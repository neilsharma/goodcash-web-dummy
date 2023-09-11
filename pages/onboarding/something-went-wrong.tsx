import Button from "@/components/Button";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { EScreenEventTitle } from "../../utils/types";
import useTrackPage from "../../shared/hooks/useTrackPage";

export default function OnboardingSomethingWrongPage() {
  useConfirmUnload();

  useTrackPage(EScreenEventTitle.SOMETHING_WENT_WRONG);

  const { back } = useRouter();

  const tryAgain = useCallback(() => {
    back();
  }, [back]);

  return (
    <OnboardingLayout>
      <Title>Something went wrong</Title>
      <SubTitle className="my-4">
        Sorry, looks like something went wrong during your application process.
      </SubTitle>
      <SubTitle className="my-4">
        Feel free to try again, and if the issue persists, please contact our support team and we’ll
        get this resolved right away.
      </SubTitle>

      <div className="flex gap-4 my-12">
        <Button onClick={tryAgain}>Try again</Button>
        <Button variant="text">Contact support</Button>
      </div>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
