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
  patchUserOnboarding,
} from "@/shared/http/services/user";
import { onboardingStepToPageMap } from "@/shared/constants";

export default function FinalizingApplication() {
  useConfirmUnload();
  const { push } = useRouter();
  const {
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
    } catch (error) {
      redirectToGenericErrorPage();
    }
  }, [
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
