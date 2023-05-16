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
      <Title>You need at least $100 in your bank account to access GoodCash</Title>
      <SubTitle className="my-4">
        The current balance in the bank account you connected is $5. Please connect a different bank
        account or replenish your bank balance before re-applying.
      </SubTitle>
      <SubTitle className="my-4">
        We require that you have at least $100 in your connected bank account to access GoodCash.
      </SubTitle>

      <Button className="my-12" onClick={tryAgain}>
        Try another account
      </Button>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
