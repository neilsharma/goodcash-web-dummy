import OnboardingLayout from "@/components/OnboardingLayout";
import {
  redirectIfServerSideRendered,
  useConfirmUnload,
  useContactInfoGuard,
} from "@/shared/hooks";

export default function OnboardingContactInfoPage() {
  useConfirmUnload();
  const allowed = useContactInfoGuard();

  if (!allowed) return <OnboardingLayout />;

  return <OnboardingLayout>Contact Info</OnboardingLayout>;
}

export const getServerSideProps = redirectIfServerSideRendered;
