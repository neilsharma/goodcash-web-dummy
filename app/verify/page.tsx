"use client";

import Button from "@/components/Button";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import FormControlText from "@/components/form-control/FormControlText";
import { useGlobal } from "@/shared/context/global";
import { EOtpErrorCode } from "@/shared/types";
import { EScreenEventTitle, ETrackEvent, GCUserState } from "@/utils/types";
import { signInWithPhoneNumber } from "firebase/auth";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useTimer } from "react-timer-hook";
import { trackEvent, trackPage } from "@/utils/analytics/analytics";
import { useWebAppErrorContext } from "@/app/context/webAppError";
import { useWebAppContext } from "../context/webApp";
import { webAppRoutes } from "../../shared/constants";
import { verifyState, verifyReducer } from "../../shared/reducers/verify";
import { getUser } from "../../shared/http/services/user";

export default function VerifyPage() {
  let inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    trackPage(EScreenEventTitle.WEB_APP_VERIFY);
  }, []);

  const { setError } = useWebAppErrorContext();
  const { confirmationResult, setConfirmationResult, resetAuth } = useGlobal();
  const { phone } = useWebAppContext();
  const { push } = useRouter();

  const [state, dispatch] = useReducer(verifyReducer, verifyState);

  const { seconds, restart } = useTimer({
    autoStart: true,
    expiryTimestamp: new Date(Date.now() + 30000),
  });
  const [isLoading, setIsLoading] = useState(false);

  const resentCode = useCallback(async () => {
    const [auth, recaptchaVerifier] = resetAuth();

    await recaptchaVerifier?.render();
    const res = await signInWithPhoneNumber(auth!, phone, recaptchaVerifier!);
    recaptchaVerifier?.clear();

    setConfirmationResult(res);
    restart(new Date(Date.now() + 30000), true);
  }, [resetAuth, phone, setConfirmationResult, restart]);

  const confirmPhone = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await confirmationResult?.confirm(state.code);

      return res?.user;
    } catch (error: any) {
      setIsLoading(false);
      trackEvent({ event: ETrackEvent.USER_LOGGED_IN_FAILED, options: { error } });

      if (error.code === EOtpErrorCode.INVALID_OTP) {
        dispatch({ type: "isOtpInvalid", payload: true });
      }

      setError(error);
    }
  }, [confirmationResult, state.code, setError]);

  const onContinue = useCallback(async () => {
    try {
      const user = await confirmPhone();
      if (!user) return;

      const token = await user.getIdToken();
      const gcUser = await getUser(token);

      if (gcUser?.state === GCUserState.LIVE) {
        push(webAppRoutes.HOME);
      }
    } catch (error) {
      setError(error);
    }
  }, [confirmPhone, push, setError]);

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "Done") {
      inputRef.current?.blur();
    }
  };

  return (
    <>
      <Title>Verify your phone number</Title>
      <SubTitle>A text message with a verification code has been sent to {phone}.</SubTitle>

      <FormControlText
        inputRef={(ref) => (inputRef.current = ref)}
        className={`tracking-[0.3em] ${
          state.isOtpInvalid ? "border-[1px] border-solid border-red-600" : ""
        }`}
        label="Verification code"
        value={state.codeMask}
        onChange={(e) => {
          dispatch({ type: "isOtpInvalid", payload: false });
          dispatch({ type: "codeMask", payload: e.target.value });
          dispatch({ type: "code", payload: e.target.value.replace(/\_/g, "") });
        }}
        placeholder="------"
        maskChar={null}
        inputMask="999999"
        inputMode="numeric"
        onKeyDown={handleKeyPress}
        error={state.isOtpInvalid ? "Code entered was incorrect, please try again" : false}
      />

      <div className="my-12 flex gap-4 flex-col sm:flex-row">
        <Button onClick={onContinue} isLoading={isLoading}>
          Continue
        </Button>
        <Button disabled={seconds !== 0} variant="text" onClick={resentCode}>
          Resend code{seconds !== 0 ? ` in 0:${seconds.toString().padStart(2, "0")}` : ""}
        </Button>
      </div>
    </>
  );
}
