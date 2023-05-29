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

  useTrackPage(EScreenEventTitle.NOT_ENOUGH_MONEY);

  const { push } = useRouter();

  const tryAgain = useCallback(() => {
    push("/onboarding/connect-bank-account");
  }, [push]);

  return (
    <OnboardingLayout>
      <Title>Insufficient Funds</Title>
      <SubTitle className="my-4">
        Your bank account balance is not sufficient to connect to GoodCash.
      </SubTitle>
      <SubTitle className="my-4">
        Please connect a different bank account or replenish your bank balance before re-applying.
      </SubTitle>

      <Button className="my-12" onClick={tryAgain}>
        Try another account
      </Button>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
