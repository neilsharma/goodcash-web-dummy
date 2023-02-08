import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { redirectIfServerSideRendered, useConfirmUnload, usePlanPageGuard } from "@/shared/hooks";
import { useOnboarding } from "@/shared/context/onboarding";
import Image from "next/image";
import { useGlobal } from "@/shared/context/global";
import { createUser } from "@/shared/http/services/user";

const CheckMark = () => (
  <Image src="/img/logo/checkmark.svg" alt="✔" width={24} height={24} priority={true} />
);

export default function OnboardingPlanPage() {
  useConfirmUnload();
  const allowed = usePlanPageGuard();
  const { push } = useRouter();
  const { auth } = useGlobal();
  const { setPlan, setUser } = useOnboarding();

  const [isLoading, setIsLoading] = useState(false);

  const onContinue = useCallback(async () => {
    setPlan("1");

    try {
      setIsLoading(true);
      setUser(await createUser(auth));
      push("/onboarding/contact-info");
    } catch (e) {
      setIsLoading(false);
    }
  }, [setPlan, setUser, push, auth]);

  if (!allowed) return <OnboardingLayout />;

  return (
    <OnboardingLayout>
      <Title>The GoodCash Plan</Title>
      <SubTitle>Build credit for the cost of a latte</SubTitle>

      <div className="my-12 h-28 border-primary border-2 rounded-2xl bg-white flex flex-col gap-2 items-center justify-center">
        <p className="m-0 flex items-start text-boldText">
          <span className="font-kansasNewSemiBold text-4xl">$5.</span>
          <span className="font-kansasNewSemiBold text-xl">99</span>
        </p>
        <p className="m-0 font-sharpGroteskBook text-sm text-boldText">per month</p>
      </div>

      <div className="my-12">
        <p className="font-sharpGroteskMedium text-black">With this plan you get:</p>

        {[
          "Grow your credit with every purchase",
          "Use your own bank account",
          "Use anywhere Mastercard is accepted",
        ].map((el) => (
          <div key={el} className="my-4 flex gap-3">
            <CheckMark />
            <p className="text-black">{el}</p>
          </div>
        ))}
      </div>

      <Button isLoading={isLoading} onClick={onContinue}>
        Continue
      </Button>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
