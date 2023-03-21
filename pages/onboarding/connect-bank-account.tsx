import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useRouter } from "next/router";
import Image from "next/image";
import Button from "@/components/Button";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import {
  redirectIfServerSideRendered,
  useConfirmUnload,
  useConnectBankAccountGuard,
} from "@/shared/hooks";
import { useOnboarding } from "@/shared/context/onboarding";
import { createBankAccount, getPlaidToken } from "@/shared/http/services/plaid";
import { submitKyc } from "@/shared/http/services/user";
import { activateLineOfCredit, submitLineOfCredit } from "@/shared/http/services/loc";

export default function OnboardingConnectBankAccountPage() {
  useConfirmUnload();
  const allowed = useConnectBankAccountGuard();
  const { push } = useRouter();
  const { setOnboardingStep, plaid, setPlaid, loc, setLoc } = useOnboarding();
  const [plaidLinkToken, setPlaidLinkToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getPlaidToken().then(setPlaidLinkToken);
  }, [setPlaidLinkToken]);

  const kycAndLoc = useCallback(async () => {
    const locId = loc.locId ? loc.locId : await submitKyc().then((r) => r.locId);
    setLoc((prev) => ({ ...prev, locId }));

    if (!loc.locSubmitted) {
      await submitLineOfCredit({ locId });
      setLoc((prev) => ({ ...prev, locSubmitted: true }));
    }

    if (!loc.locActivated) {
      await activateLineOfCredit({ locId });
      setLoc((prev) => ({ ...prev, locActivated: true }));
    }

    setOnboardingStep("FINALIZING_APPLICATION");
    push("/onboarding/finalizing-application");
  }, [loc, setLoc, setOnboardingStep, push]);

  const { open, ready } = usePlaidLink({
    token: plaidLinkToken,
    onSuccess: async (publicToken, metadata) => {
      try {
        setIsLoading(true);

        await createBankAccount({ plaidPublicToken: publicToken });
        setPlaid({ publicToken, metadata });

        await kycAndLoc();
      } catch (e: any) {
        const message = e?.response?.data?.message;
        const errorObject = message ? attemptParse(message) : null;

        if (errorObject?.errorCode === "UNDERWRITING0001") {
          return push("/onboarding/not-enough-money");
        }

        push("/onboarding/something-went-wrong");
      }
    },
  });

  const onContinue = useCallback(async () => {
    if (!ready || !plaidLinkToken) return;

    if (plaid) {
      setIsLoading(true);

      const kyc = await submitKyc().catch((e) => {
        setIsLoading(false);
        throw e;
      });

      setIsLoading(false);

      return kyc;
    }

    open();
  }, [plaid, open, ready, plaidLinkToken, setIsLoading]);

  if (!allowed) return <OnboardingLayout />;

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
        onClick={plaid ? kycAndLoc : onContinue}
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
