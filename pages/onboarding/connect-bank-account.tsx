import { useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";
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

export default function OnboardingConnectBankAccountPage() {
  useConfirmUnload();
  const allowed = useConnectBankAccountGuard();
  const { plaid, setPlaid } = useOnboarding();

  const { open, ready } = usePlaidLink({
    token: "<GENERATED_LINK_TOKEN>",
    onSuccess: (publicToken, metadata) => {
      setPlaid({ publicToken, metadata });
    },
  });

  const onContinue = useCallback(() => {
    if (!ready) return;

    open();
  }, [open, ready]);

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

      <Button disabled={!ready} onClick={onContinue}>
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

export const getServerSideProps = redirectIfServerSideRendered;
