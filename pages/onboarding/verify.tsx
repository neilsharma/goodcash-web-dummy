import { useCallback, useState } from "react";
import { signInWithPhoneNumber } from "firebase/auth";
import { useTimer } from "react-timer-hook";
import Button from "@/components/Button";
import FormControlText from "@/components/form-control/FormControlText";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { redirectIfServerSideRendered, useConfirmUnload, useVerifyPageGuard } from "@/shared/hooks";
import { useOnboarding } from "@/shared/context/onboarding";
import { useRouter } from "next/router";
import { useGlobal } from "@/shared/context/global";

export default function OnboardingVerifyPage() {
  useConfirmUnload();
  const { confirmationResult, setConfirmationResult, resetAuth } = useGlobal();
  const { phone, phoneVerified, setPhoneVerified } = useOnboarding();
  const { push } = useRouter();
  const allowed = useVerifyPageGuard();

  const [code, setCode] = useState("");
  const [codeMask, setCodeMask] = useState("");
  const { seconds, restart } = useTimer({
    autoStart: true,
    expiryTimestamp: new Date(Date.now() + 30000),
  });

  const resentCode = useCallback(async () => {
    const [auth, recaptchaVerifier] = resetAuth();

    await recaptchaVerifier?.render();
    const res = await signInWithPhoneNumber(auth!, phone, recaptchaVerifier!);
    recaptchaVerifier?.clear();

    setConfirmationResult(res);
    restart(new Date(Date.now() + 30000), true);
  }, [resetAuth, phone, setConfirmationResult, restart]);

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

      <div className="my-12 flex gap-4">
        <Button onClick={onContinue}>Continue</Button>
        <Button disabled={seconds !== 0} variant="text" onClick={resentCode}>
          Resend code{seconds !== 0 ? ` in 0:${seconds.toString().padStart(2, "0")}` : ""}
        </Button>
      </div>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
