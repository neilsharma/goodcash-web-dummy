import { useCallback } from "react";
import Button from "@/components/Button";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import { EScreenEventTitle } from "../../../utils/types";
import useTrackPage from "../../../shared/hooks/useTrackPage";
import { useOnboarding } from "@/shared/context/onboarding";
import { EStepStatus } from "../../../shared/types";

export default function ThanksForJoining() {
  useConfirmUnload();
  const { setOnboardingStep, onboardingStepHandler } = useOnboarding();
  useTrackPage(EScreenEventTitle.THANKS_FOR_JOINING);

  const navigate = useCallback(() => {
    setOnboardingStep("APP_DOWNLOAD");
    onboardingStepHandler(EStepStatus.COMPLETED);
  }, [onboardingStepHandler, setOnboardingStep]);

  return (
    <OnboardingLayout>
      <Title className="text-primary text-center">Thanks for joining GoodCash!</Title>
      <SubTitle className="mt-8 text-center text-boldText">
        As a gift for being one of our first beta users, we’re waiving your GoodCash fee.
      </SubTitle>
      <SubTitle className="mt-8 text-center text-boldText">
        Therefore, we will not charge you a fee for using GoodCash.
      </SubTitle>

      <Button className="mt-12" onClick={navigate}>
        Continue
      </Button>

      <p className="font-sharpGroteskBook text-boldText text-sm my-6 text-center">
        If you have any comments or questions, we’d love to hear from you. Just email us at
        support@goodcash.com
      </p>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
