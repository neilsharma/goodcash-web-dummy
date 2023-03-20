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
} from "@/shared/http/services/user";

export default function FinalizingApplication() {
  useConfirmUnload();
  const { push } = useRouter();
  const {
    pierOnboardingStatus,
    setPierOnboardingStatus,
    pierBorrowerId,
    setPierBorrowerId,
    pierApplicationId,
    setPierApplicationId,
  } = useOnboarding();

  const finalizeApplication = useCallback(async () => {
    let onboardingStatus = pierOnboardingStatus;
    let borrowerId = pierBorrowerId;
    let applicationId = pierApplicationId;

    if (onboardingStatus === null || borrowerId === null) {
      const { id } = await createPierBorrower();
      setPierBorrowerId((borrowerId = id));
      setPierOnboardingStatus((onboardingStatus = "BORROWER_CREATED"));
    }

    if (onboardingStatus === "BORROWER_CREATED" || applicationId === null) {
      const { id } = await createPierApplication(borrowerId);

      setPierApplicationId((applicationId = id));
      setPierOnboardingStatus((onboardingStatus = "APPLICATION_CREATED"));
    }

    if (onboardingStatus === "APPLICATION_CREATED") {
      await approvePierApplication(applicationId);

      setPierOnboardingStatus((onboardingStatus = "APPLICATION_APPROVED"));
    }

    if (onboardingStatus === "APPLICATION_APPROVED") {
      push("/onboarding/one-last-step");
    }
  }, [
    pierOnboardingStatus,
    setPierOnboardingStatus,
    pierBorrowerId,
    setPierBorrowerId,
    pierApplicationId,
    setPierApplicationId,
    push,
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
