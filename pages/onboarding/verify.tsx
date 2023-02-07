import Button from "@/components/Button";
import FormControlText from "@/components/form-control/FormControlText";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { redirectIfServerSideRendered, useConfirmUnload, useVerifyPageGuard } from "@/shared/hooks";
import { useOnboarding } from "@/shared/context/onboarding";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useGlobal } from "@/shared/context/global";

export default function OnboardingVerifyPage() {
  useConfirmUnload();
  const { confirmationResult } = useGlobal();
  const { phone, phoneVerified, setPhoneVerified } = useOnboarding();
  const { push } = useRouter();
  const allowed = useVerifyPageGuard();

  const [code, setCode] = useState("");
  const [codeMask, setCodeMask] = useState("");

  const confirmPhone = useCallback(async () => {
    if (phoneVerified) return phoneVerified;

    const res = await confirmationResult?.confirm(code);

    const isValid = !!res?.user;

    if (isValid) setPhoneVerified(isValid);
    return isValid;
  }, [setPhoneVerified, confirmationResult, code, phoneVerified]);

  const onContinue = useCallback(async () => {
    if (!(await confirmPhone())) return;

    push("/onboarding/plan");
  }, [push, confirmPhone]);

  if (!allowed) return <OnboardingLayout />;

  return (
    <OnboardingLayout>
      <Title>Verify your phone number</Title>
      <SubTitle>A text message with a verification code has been sent to {phone}.</SubTitle>

      <FormControlText
        className="tracking-[0.3em]"
        label="Verification code"
        value={codeMask}
        onChange={(e) => {
          setCodeMask(e.target.value);
          setCode(e.target.value.replace(/\_/g, ""));
        }}
        placeholder="------"
        inputMask="999999"
      />

      <Button className="mt-12" onClick={onContinue}>
        Continue
      </Button>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
