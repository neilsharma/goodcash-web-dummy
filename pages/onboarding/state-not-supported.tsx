import Button from "@/components/Button";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { onboardingStepToPageMap } from "@/shared/constants";
import { useOnboarding } from "@/shared/context/onboarding";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { EScreenEventTitle } from "../../utils/types";
import useTrackPage from "../../shared/hooks/useTrackPage";

export default function OnboardingStateNotSupportedPage() {
  useConfirmUnload();

  useTrackPage(EScreenEventTitle.STATE_NOT_SUPPORTED);

  const { push } = useRouter();
  const { onboardingStep } = useOnboarding();

  const tryAgain = useCallback(() => {
    push(onboardingStepToPageMap[onboardingStep]);
  }, [push, onboardingStep]);

  return (
    <OnboardingLayout>
      <Title>We’re hoping to support your state soon!</Title>
      <SubTitle className="my-4">
        Unfortunately, your state isn’t supported at the moment. We’re working to support all states
        in the US, join our waitlist to be notified when we launch in your state!
      </SubTitle>

      <div className="flex gap-4 my-12">
        <Button onClick={tryAgain}>Join waitlist</Button>
      </div>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
