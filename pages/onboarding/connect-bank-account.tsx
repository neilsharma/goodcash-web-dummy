import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useRouter } from "next/router";
import Image from "next/image";
import Button from "@/components/Button";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import { useOnboarding } from "@/shared/context/onboarding";
import { createBankAccount, getPlaidToken } from "@/shared/http/services/plaid";
import { patchUserOnboarding, submitKyc } from "@/shared/http/services/user";
import { activateLineOfCredit, submitLineOfCredit } from "@/shared/http/services/loc";
import { onboardingStepToPageMap } from "@/shared/constants";

export default function OnboardingConnectBankAccountPage() {
  useConfirmUnload();
  const { push } = useRouter();
  const {
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    setOnboardingStep,
    plaid,
    setPlaid,
    locId,
    setLocId,
    redirectToGenericErrorPage,
  } = useOnboarding();
  const [plaidLinkToken, setPlaidLinkToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getPlaidToken().then(setPlaidLinkToken);
  }, [setPlaidLinkToken]);

  const kycAndLoc = useCallback(async () => {
    let _locId = locId;

    if (!_locId || !onboardingOperationsMap.kycSubmitted) {
      const kyc = await submitKyc();
      _locId = kyc.locId;
      setLocId(kyc.locId);
      setOnboardingOperationsMap((p) => ({ ...p, kycSubmitted: true }));
      patchUserOnboarding({ onboardingOperationsMap: { kycSubmitted: true } });
    }

    if (!onboardingOperationsMap.locSubmitted) {
      await submitLineOfCredit({ locId: _locId });
      setOnboardingOperationsMap((p) => ({ ...p, locSubmitted: true }));
      patchUserOnboarding({ onboardingOperationsMap: { locSubmitted: true } });
    }

    if (!onboardingOperationsMap.locActivated) {
      await activateLineOfCredit({ locId: _locId });
      setOnboardingOperationsMap((p) => ({ ...p, locActivated: true }));
      patchUserOnboarding({
        onboardingStep: "FINALIZING_APPLICATION",
        onboardingOperationsMap: { locActivated: true },
      });
    }

    setOnboardingStep("FINALIZING_APPLICATION");
    push(onboardingStepToPageMap.FINALIZING_APPLICATION);
  }, [
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    locId,
    setLocId,
    setOnboardingStep,
    push,
  ]);

  const { open, ready } = usePlaidLink({
    token: plaidLinkToken,
    onSuccess: async (publicToken, metadata) => {
      try {
        setIsLoading(true);

        if (!onboardingOperationsMap.bankAccountCreated) {
          await createBankAccount({ plaidPublicToken: publicToken });
          setOnboardingOperationsMap((p) => ({ ...p, bankAccountCreated: true }));
          setPlaid({ publicToken, metadata });
          patchUserOnboarding({
            plaid: { publicToken, metadata },
            onboardingOperationsMap: { bankAccountCreated: true },
          });
        }

        await kycAndLoc();
      } catch (e: any) {
        const message = e?.response?.data?.message;
        const errorObject = message ? attemptParse(message) : null;

        if (errorObject?.errorCode === "UNDERWRITING0001") {
          return push("/onboarding/not-enough-money");
        }

        redirectToGenericErrorPage();
      }
    },
  });

  const onContinue = useCallback(async () => {
    if (!ready || !plaidLinkToken) return;

    open();
  }, [open, ready, plaidLinkToken]);

  return (
    <OnboardingLayout>
      <Title>Connect your bank</Title>
      <SubTitle>
        GoodCash uses Plaid to securely connect to your bank account. GoodCash does not retain your
        bank login information.
      </SubTitle>

      <div className="my-12 font-sharpGroteskBook text-black">
        <p className="text-lg my-4">This connection allow GoodCash to:</p>

        {connectionWillAllow.map(([logo, text]) => (
          <div className="my-4 flex gap-2 items-start" key={logo + text}>
            <Image
              src={`/img/logo/${logo}.svg`}
              alt="lock"
              width={24}
              height={24}
              priority={true}
            />
            <p>{text}</p>
          </div>
        ))}
      </div>

      <Button
        disabled={!ready || !plaidLinkToken}
        isLoading={isLoading}
        onClick={
          plaid && onboardingOperationsMap.bankAccountCreated
            ? () => kycAndLoc().catch(redirectToGenericErrorPage)
            : onContinue
        }
      >
        Continue
      </Button>
    </OnboardingLayout>
  );
}

const connectionWillAllow = [
  ["lock", "Determine your eligibility"],
  ["dollar", "Calculate your “Available to Spend” amount"],
  ["cart", "Use your bank account to cover your GoodCash purchases"],
  [
    "trending-up",
    "Give your regular bank account super powers like growing your credit and earning rewards",
  ],
];

const attemptParse = (jsonString: string | object) => {
  if (typeof jsonString === "object") return jsonString;

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
};

export const getServerSideProps = redirectIfServerSideRendered;
