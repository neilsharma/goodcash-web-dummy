import Button from "@/components/Button";
import FormControl from "@/components/FormControl";
import OnboardingLayout from "@/components/OnboardingLayout";

export default function OnboardingIndexPage() {
  return (
    <OnboardingLayout>
      <h1 className="font-kansasNewSemiBold text-4xl mb-4 text-boldText">
        Welcome to GoodCash
      </h1>
      <p className="font-sharpGroteskBook text-lg text-text">
        Grow your credit with your existing bank account and the GoodCash card.
        No interest, no credit checks, no surprises.
      </p>

      <div className="flex gap-6">
        <FormControl label="First Name" placeholder="John" />
        <FormControl label="Last Name" placeholder="Smith" />
      </div>

      <FormControl label="Phone number" placeholder="415 555 5555" />

      <FormControl label="Email address" placeholder="john@example.com" />

      <Button>Continue</Button>
    </OnboardingLayout>
  );
}
