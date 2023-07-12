import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";

export default function OnboardingIndexPage() {
  return (
    <OnboardingLayout skipGuard pageTitle="GoodCash Account Closure">
      <Title className="flex justify-center mt-8 mb-[7vh]">Account Closure</Title>
      <SubTitle className="mt-8 text-center">
        We understand that sometimes circumstances change and you may need to close your account.
        Our support team is here to assist you through this process. Contact us at
        support@goodcash.com
      </SubTitle>

      <p className="font-sharpGroteskBook text-thinText text-xs mt-8 text-center">
        Please note, GoodCash retains necessary data for reasons like system security, fraud
        prevention, and regulatory compliance.
      </p>
    </OnboardingLayout>
  );
}
