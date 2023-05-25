import Button from "@/components/Button";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { EScreenEventTitle } from "../../utils/types";
import useTrackPage from "../../shared/hooks/useTrackPage";
import { waitListUrl } from "../../shared/constants";

export default function OnboardingStateNotSupportedPage() {
  useConfirmUnload();

  useTrackPage(EScreenEventTitle.UNSUPPORTED_STATE);

  const { push } = useRouter();

  const tryAgain = useCallback(() => {
    window.onbeforeunload = null;
    push(waitListUrl);
  }, [push]);

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
