"use client";
import Button from "@/components/Button";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import FormControlText from "@/components/form-control/FormControlText";
import { privacyPolicyUrl, termsOfServiceUrl, webAppRoutes } from "@/shared/constants";
import { useCallback, useEffect, useState } from "react";
import { trackPage } from "@/utils/analytics/analytics";
import { EScreenEventTitle } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth-context";

export default function LoginPage() {
  const { phone, setPhone, setConfirmationResult, auth, recaptchaVerifier } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [dimBackground, setDimBackground] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    trackPage(EScreenEventTitle.WEB_APP_LOGIN);
  }, []);

  const onContinue = useCallback(async () => {
    // setIsLoading(true);
    try {
      // setDimBackground(true);
      // const res = await signInWithPhoneNumber(auth!, phone, recaptchaVerifier!);
      // recaptchaVerifier?.clear();
      // setConfirmationResult(res);
      // setDimBackground(false);
      console.log("pushing next route");
      push(webAppRoutes.VERIFY);
    } catch (e) {
      setIsLoading(false);
      setDimBackground(false);
    }
  }, [setConfirmationResult, push, phone, auth, recaptchaVerifier]);

  return (
    <>
      {dimBackground && <div className="fixed top-0 left-0 h-[100vh] w-[100vw] bg-black/70 z-10" />}
      <Title>Welcome to GoodCash</Title>
      <SubTitle>
        Grow your credit with your existing bank account and the GoodCash card. No interest, no
        credit checks, no surprises.
      </SubTitle>
      <FormControlText
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value.replace(/\s|\_/g, ""));
        }}
        label="Phone number"
        type="tel"
        maskChar={null}
        placeholder="+1 999 999 9999"
        inputMask="+1 999 999 9999"
      />
      <Button
        className="mt-12"
        isLoading={isLoading}
        disabled={phone.length < 10}
        onClick={onContinue}
      >
        Continue
      </Button>
      <p className="font-sharpGroteskBook text-thinText text-sm my-6">
        By continuing, you agree to GoodCash’s{" "}
        <a href={termsOfServiceUrl} rel="noreferrer" target="_blank">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href={privacyPolicyUrl} rel="noreferrer" target="_blank">
          Privacy Policy
        </a>
      </p>
    </>
  );
}
