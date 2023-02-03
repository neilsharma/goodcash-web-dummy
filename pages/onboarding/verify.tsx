import Button from "@/components/Button";
import FormControl from "@/components/FormControl";
import OnboardingLayout from "@/components/OnboardingLayout";
import {
  redirectIfServerSideRendered,
  useIndexPageComplected,
} from "@/shared/hooks";
import { useOnboarding } from "@/shared/onboarding/context";
import { useState } from "react";

export default function OnboardingVerifyPage() {
  const { phone, phoneVerified, setPhoneVerified } = useOnboarding();
  const indexPageCompleted = useIndexPageComplected();

  const [code, setCode] = useState("");

  if (!indexPageCompleted) return <OnboardingLayout />;

  return (
    <OnboardingLayout>
      <h1 className="font-kansasNewSemiBold text-4xl mb-4 text-boldText">
        Verify your phone number
      </h1>
      <p className="font-sharpGroteskBook text-lg">
        A text message with a verification code has been sent to {phone}.
      </p>

      <FormControl
        label="Verification code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="- - - -"
      />

      {!phoneVerified && (
        <Button onClick={() => setPhoneVerified(true)}>Verify</Button>
      )}

      <Button className="mt-12" disabled={!phoneVerified}>
        Continue
      </Button>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
