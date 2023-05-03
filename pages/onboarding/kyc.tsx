import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import { useOnboarding } from "@/shared/context/onboarding";
import { getKycPlaidToken } from "@/shared/http/services/plaid";
import { fillKYCIdentity, patchUserOnboarding } from "@/shared/http/services/user";
import { onboardingStepToPageMap } from "@/shared/constants";
import { goodcashEnvironment } from "@/shared/config";

export default function OnboardingPlaidKycPage() {
  useConfirmUnload();
  const { push } = useRouter();
  const {
    phone,
    email,
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    setOnboardingStep,
    redirectToGenericErrorPage,
  } = useOnboarding();
  const [plaidLinkToken, setPlaidLinkToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shouldBeClosed, setShouldBeClosed] = useState(false);

  useEffect(() => {
    getKycPlaidToken({ phone, email }).then(setPlaidLinkToken);
  }, [phone, email, setPlaidLinkToken]);

  const { open, exit, ready } = usePlaidLink({
    token: plaidLinkToken,
    onSuccess: async (_publicToken, metadata) => {
      try {
        setIsLoading(true);

        if (!onboardingOperationsMap.userKycFilled) {
          await fillKYCIdentity({ sessionId: metadata.link_session_id });

          if (goodcashEnvironment !== "production") setShouldBeClosed(true);

          setOnboardingOperationsMap((p) => ({ ...p, userKycFilled: true }));
        }

        setOnboardingStep("BANK_ACCOUNT_CONNECTION");
        patchUserOnboarding({
          onboardingStep: "BANK_ACCOUNT_CONNECTION",
          onboardingOperationsMap: { userKycFilled: true },
        });

        push(onboardingStepToPageMap.BANK_ACCOUNT_CONNECTION);
      } catch (e) {
        setShouldBeClosed(true);
        redirectToGenericErrorPage();
      }
    },
  });

  useEffect(() => {
    if (shouldBeClosed) exit({ force: true });
  }, [shouldBeClosed, exit]);

  const onContinue = useCallback(() => {
    if (!ready || !plaidLinkToken) return;

    open();
  }, [open, ready, plaidLinkToken]);

  return (
    <OnboardingLayout>
      <Title>Verify your identity</Title>
      <SubTitle>GoodCash uses Plaid to perform identity verification.</SubTitle>

      <Button
        className="mt-10"
        disabled={!ready || !plaidLinkToken}
        isLoading={isLoading}
        onClick={onContinue}
      >
        Continue
      </Button>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
