import OnboardingLayout from "@/components/OnboardingLayout";
import { useOnboarding } from "@/shared/context/onboarding";
import Link from "next/link";

export default function Onboarding() {
  const { testValue: val, setTestValue: setVal } = useOnboarding();

  return (
    <OnboardingLayout>
      <h1 className="font-kansasNewSemiBold text-3xl">Welcome to GoodCash</h1>
      <p className="text-l">
        Grow your credit with your existing bank account and the GoodCash card.
        No interest, no credit checks, no surprises.
      </p>
      <div>Onboarding: {String(val)}</div>
      <button onClick={() => setVal((v) => !v)}>toggle</button>
      <br />
      <Link href="/">to home</Link>
    </OnboardingLayout>
  );
}
