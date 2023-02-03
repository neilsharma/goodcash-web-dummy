import Button from "@/components/Button";
import FormControl from "@/components/FormControl";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { redirectIfServerSideRendered, useConfirmUnload, useVerifyPageGuard } from "@/shared/hooks";
import { useOnboarding } from "@/shared/onboarding/context";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

export default function OnboardingVerifyPage() {
  useConfirmUnload();
  const { push } = useRouter();
  const allowed = useVerifyPageGuard();
  const { phone, phoneVerified, setPhoneVerified } = useOnboarding();

  const [code, setCode] = useState("");

  const confirmPhone = useCallback(() => {
    if (code === "1234") setPhoneVerified(true);
  }, [setPhoneVerified, code]);

  const onContinue = useCallback(() => {
    if (!phoneVerified) return;

    push("/onboarding/plan");
  }, [phoneVerified, push]);

  if (!allowed) return <OnboardingLayout />;

  return (
    <OnboardingLayout>
      <Title>Verify your phone number</Title>
      <SubTitle>A text message with a verification code has been sent to {phone}.</SubTitle>

      <FormControl
        className="tracking-[0.3em]"
        label="Verification code"
        value={code}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9]/g, "");

          if (value.length < 5) setCode(value);
        }}
        placeholder="----"
      />

      {!phoneVerified && <Button onClick={confirmPhone}>Verify</Button>}

      <Button className="mt-12" disabled={!phoneVerified} onClick={onContinue}>
        Continue
      </Button>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
