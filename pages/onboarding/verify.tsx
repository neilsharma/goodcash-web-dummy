import OnboardingLayout from "@/components/OnboardingLayout";
import {
  redirectIfServerSideRendered,
  useIndexPageComplected,
} from "@/shared/hooks";
import { useOnboarding } from "@/shared/onboarding/context";

export default function OnboardingVerifyPage() {
  const indexPageCompleted = useIndexPageComplected();

  if (!indexPageCompleted) return <OnboardingLayout />;

  return <OnboardingLayout>Verify</OnboardingLayout>;
}

export const getServerSideProps = redirectIfServerSideRendered;
