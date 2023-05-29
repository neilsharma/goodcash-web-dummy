import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import Lottie from "react-lottie";
import * as animationData from "../../public/lottie/growing-tree.json";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import { useOnboarding } from "@/shared/context/onboarding";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import {
  approvePierApplication,
  createPierApplication,
  createPierBorrower,
  getAssetStatus,
  patchUserOnboarding,
} from "@/shared/http/services/user";
import { onboardingStepToPageMap } from "@/shared/constants";
import { failUnderwriting, underwrite } from "@/shared/http/services/underwriting";
import { isLocalhost } from "@/shared/config";
import { parseApiError } from "@/shared/error";
import { EScreenEventTitle } from "../../utils/types";
import useTrackPage from "../../shared/hooks/useTrackPage";

export default function FinalizingApplication() {
  useConfirmUnload();

  const { push } = useRouter();
  const {
    setIsUserBlocked,
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    setOnboardingStep,
    pierBorrowerId,
    setPierBorrowerId,
    pierApplicationId,
    setPierApplicationId,
    redirectToGenericErrorPage,
  } = useOnboarding();

  const finalizeApplication = useCallback(async () => {
    try {
      let borrowerId = pierBorrowerId;
      let applicationId = pierApplicationId;

      if (!onboardingOperationsMap.pierBorrowerCreated || borrowerId === null) {
        const { id } = await createPierBorrower();
        setPierBorrowerId((borrowerId = id));
        setOnboardingOperationsMap((p) => ({ ...p, pierBorrowerCreated: true }));
        patchUserOnboarding({
          pierBorrowerId: id,
          onboardingOperationsMap: { pierBorrowerCreated: true },
        });
      }

      if (!onboardingOperationsMap.pierApplicationCreated || applicationId === null) {
        const { id } = await createPierApplication(borrowerId);

        setPierApplicationId((applicationId = id));
        setOnboardingOperationsMap((p) => ({ ...p, pierApplicationCreated: true }));
        patchUserOnboarding({
          pierApplicationId: id,
          onboardingOperationsMap: { pierApplicationCreated: true },
        });
      }

      if (!isLocalhost && !onboardingOperationsMap.underwritingSucceeded) {
        const maxAttempts = 100;
        let shouldForceFail = false;

        await new Promise((resolve, reject) => {
          let attempts = 0;

          const interval = setInterval(async () => {
            const status = await getAssetStatus();
            attempts++;

            if (status === "APPROVED") {
              clearInterval(interval);
              return resolve(true);
            }

            if (status === "DENIED") {
              clearInterval(interval);
              return reject(false);
            }

            if (attempts > maxAttempts) {
              clearInterval(interval);
              shouldForceFail = true;
              return resolve(true);
            }
          }, 500);
        });

        if (shouldForceFail) {
          await failUnderwriting();
          return setIsUserBlocked(true);
        }

        const { status } = await underwrite();

        switch (status) {
          case "APPROVED":
            setOnboardingOperationsMap((p) => ({ ...p, underwritingSucceeded: true }));
            patchUserOnboarding({
              onboardingOperationsMap: { underwritingSucceeded: true },
            });
            break;
          case "DENIED":
            setOnboardingOperationsMap((p) => ({ ...p, pierApplicationCreated: false }));
            setPierApplicationId(null);
            patchUserOnboarding({
              pierApplicationId: null,
              onboardingOperationsMap: { pierApplicationCreated: false },
            });
            return push("/onboarding/not-enough-money");
        }
      }

      if (!onboardingOperationsMap.pierApplicationApproved) {
        await approvePierApplication(applicationId);

        setOnboardingOperationsMap((p) => ({ ...p, pierApplicationApproved: true }));
        patchUserOnboarding({
          onboardingStep: "DOC_GENERATION",
          onboardingOperationsMap: { pierApplicationApproved: true },
        });
      }

      setOnboardingStep("DOC_GENERATION");
      push(onboardingStepToPageMap.DOC_GENERATION);
    } catch (error: any) {
      const errorObject = parseApiError(error);

      if (errorObject?.errorCode === "UNDERWRITING0002") return setIsUserBlocked(true);

      redirectToGenericErrorPage();
    }
  }, [
    setIsUserBlocked,
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    pierBorrowerId,
    setPierBorrowerId,
    pierApplicationId,
    setPierApplicationId,
    setOnboardingStep,
    push,
    redirectToGenericErrorPage,
  ]);

  useTrackPage(EScreenEventTitle.FINALIZING_APPLICATION);

  useEffect(() => {
    finalizeApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OnboardingLayout>
      <Lottie options={{ loop: true, autoplay: true, animationData }} />
      <SubTitle className="text-center">Finalizing application...</SubTitle>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
