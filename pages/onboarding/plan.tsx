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

type PlanFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "THIRTY_DAYS" | "ANNUAL";
interface Plan {
  id: string;
  name: string;
  planType: "UNIFORM";
  frequency: PlanFrequency;
  currency: "USD";
  price: number;
  productId: string;
}

export default function OnboardingPlanPage() {
  useConfirmUnload();
  const allowed = usePlanPageGuard();
  const { push } = useRouter();
  const { auth } = useGlobal();
  const { setOnboardingStep, setPlan, setUser } = useOnboarding();

  const [isLoading, setIsLoading] = useState(false);

  const onContinue = useCallback(async () => {
    setPlan("1");

    try {
      setIsLoading(true);
      setUser(await createUser(auth));
      setOnboardingStep("CONTACT_INFO");
      push("/onboarding/contact-info");
    } catch (e) {
      setIsLoading(false);
    }
  }, [setPlan, setUser, setOnboardingStep, push, auth]);

  if (!allowed) return <OnboardingLayout />;

  return (
    <OnboardingLayout>
      <Title>The GoodCash Plan</Title>
      <SubTitle>Build credit for the cost of a latte</SubTitle>

      <div className="my-12 h-28 rounded-2xl bg-bgLight text-boldText flex items-center gap-4 p-6">
        <Image
          src="/img/goodcash-card-circle.png"
          alt="card"
          width={56}
          height={56}
          priority={true}
        />
        <div>
          <p className="font-kansasNew text-3xl font-bold">
            ${hardcodedPlan.price} per {resolveText(hardcodedPlan.frequency)}
          </p>
          <p className="font-sharpGroteskBook text-xs">Earn rewards and build credit</p>
        </div>
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

const resolveText = (frequency: PlanFrequency) => {
  switch (frequency) {
    case "DAILY":
      return "day";
    case "WEEKLY":
      return "week";
    case "THIRTY_DAYS":
      return "thirty days";
    case "MONTHLY":
      return "month";
    default:
      return "month";
  }
};

const hardcodedPlan: Plan = {
  id: "1",
  name: "5.99 Monthly Subscription",
  planType: "UNIFORM",
  frequency: "MONTHLY",
  price: 5.99,
  currency: "USD",
  productId: "1",
};

const CheckMark = () => (
  <Image src="/img/logo/checkmark.svg" alt="✔" width={24} height={24} priority={true} />
);

export const getServerSideProps = redirectIfServerSideRendered;
