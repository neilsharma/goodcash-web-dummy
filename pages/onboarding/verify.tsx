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
  const [codeMask, setCodeMask] = useState("");

  const confirmPhone = useCallback(() => {
    if (phoneVerified) return phoneVerified;

    const isValid = code === "1234";

    if (isValid) setPhoneVerified(isValid);
    return isValid;
  }, [setPhoneVerified, code, phoneVerified]);

  const onContinue = useCallback(() => {
    if (!confirmPhone()) return;

    push("/onboarding/plan");
  }, [push, confirmPhone]);

  if (!allowed) return <OnboardingLayout />;

  return (
    <OnboardingLayout>
      <Title>Verify your phone number</Title>
      <SubTitle>A text message with a verification code has been sent to {phone}.</SubTitle>

      <FormControl
        className="tracking-[0.3em]"
        label="Verification code"
        value={codeMask}
        onChange={(e) => {
          setCodeMask(e.target.value);
          setCode(e.target.value.replace(/\_/g, ""));
        }}
        placeholder="----"
        inputMask="9999"
      />

      <Button className="mt-12" onClick={onContinue}>
        Continue
      </Button>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
