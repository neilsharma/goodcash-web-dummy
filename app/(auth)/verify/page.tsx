"use client";

import Button from "@/components/Button";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import FormControlText from "@/components/form-control/FormControlText";
import { EOtpErrorCode } from "@/shared/types";
import { EScreenEventTitle, ETrackEvent } from "@/utils/types";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useTimer } from "react-timer-hook";
import { trackEvent, trackPage } from "@/utils/analytics/analytics";
import { verifyState, verifyReducer } from "../../../shared/reducers/verify";
import { useAuth } from "../auth-context";
import { signInWithPhoneNumber } from "firebase/auth";
import { webAppRoutes } from "@/shared/constants";
import { useErrorContext } from "../../error-context";

// const { getUser } = new UserHttpService(appRouterClientSideHttpClient);

export default function VerifyPage() {
  const { auth, phone, setConfirmationResult, recaptchaVerifier, confirmationResult } = useAuth();
  let inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    trackPage(EScreenEventTitle.WEB_APP_VERIFY);
  }, []);

  const { setError } = useErrorContext();
  const { push } = useRouter();

  const [state, dispatch] = useReducer(verifyReducer, verifyState);

  const { seconds, restart } = useTimer({
    autoStart: true,
    expiryTimestamp: new Date(Date.now() + 30000),
  });

  const resendCode = useCallback(async () => {
    await recaptchaVerifier!.render();
    const res = await signInWithPhoneNumber(auth!, phone, recaptchaVerifier!);
    recaptchaVerifier?.clear();

    setConfirmationResult(res);
  }, [auth, phone, recaptchaVerifier, setConfirmationResult]);

  const resendCodeHandler = useCallback(async () => {
    await resendCode();
    restart(new Date(Date.now() + 30000), true);
  }, [resendCode, restart]);

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
      // const user = await confirmPhone();
      // if (!user) return;
      // const token = await user.getIdToken();

      // await fetch("/api/login", { method: "POST", headers: { [TOKEN_KEY]: token } });

      // const gcUser = await getUser();

      // if (!gcUser) throw new Error();

      // const { errorCode, shouldSignOut } = checkUserState(gcUser.state);

      // if (errorCode) {
      // const error: Error & { code?: string } = new Error();
      // error.code = errorCode;
      //
      // if (shouldSignOut) await userLogoutHandler();

      // throw error;
      // }

      return push(webAppRoutes.HOME);
    } catch (error: any) {
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
        <Button disabled={seconds !== 0} variant="text" onClick={resendCodeHandler}>
          Resend code{seconds !== 0 ? ` in 0:${seconds.toString().padStart(2, "0")}` : ""}
        </Button>
      </div>
    </>
  );
}
