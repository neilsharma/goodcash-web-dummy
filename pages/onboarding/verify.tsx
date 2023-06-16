import Button from "@/components/Button";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import FormControlText from "@/components/form-control/FormControlText";
import { onboardingStepToPageMap } from "@/shared/constants";
import { useGlobal } from "@/shared/context/global";
import { useOnboarding } from "@/shared/context/onboarding";
import { EFeature, init, isFeatureEnabled } from "@/shared/feature";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import {
  createUser,
  getUser,
  getUserOnboarding,
  patchUserOnboarding,
} from "@/shared/http/services/user";
import { EOtpErrorCode, hardcodedPlan } from "@/shared/types";
import { EScreenEventTitle, ETrackEvent } from "@/utils/types";
import { signInWithPhoneNumber } from "firebase/auth";
import { useRouter } from "next/router";
import { KeyboardEvent, useCallback, useRef, useState } from "react";
import { useTimer } from "react-timer-hook";
import { parseApiError } from "../../shared/error";
import useTrackPage from "../../shared/hooks/useTrackPage";
import { setUserId, setUserProperties, trackEvent } from "../../utils/analytics/analytics";

export default function OnboardingVerifyPage() {
  useConfirmUnload();
  let inputRef = useRef<HTMLInputElement | null>(null);

  useTrackPage(EScreenEventTitle.VERIFY);

  const { confirmationResult, setConfirmationResult, resetAuth, auth, userSession } = useGlobal();
  const {
    setIsUserBlocked,
    setOnboardingStep,
    phone,
    firstName,
    lastName,
    email,
    setPhoneVerified,
    mergeOnboardingState,
    redirectToGenericErrorPage,
    setUser,
    setOnboardingOperationsMap,
  } = useOnboarding();
  const { push } = useRouter();

  const [code, setCode] = useState("");
  const [codeMask, setCodeMask] = useState("");
  const [isOtpInvalid, setIsOtpInvalid] = useState(false);
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

      const res = await confirmationResult?.confirm(code);

      setPhoneVerified(!!res?.user);

      return res?.user;
    } catch (e: any) {
      setIsLoading(false);
      trackEvent({ event: ETrackEvent.USER_LOGGED_IN_FAILED });

      if (e.code === EOtpErrorCode.INVALID_OTP) {
        setIsOtpInvalid(true);
      } else {
        redirectToGenericErrorPage();
      }
    }
  }, [confirmationResult, code, setPhoneVerified, redirectToGenericErrorPage]);

  const userCreationHandler = useCallback(async () => {
    try {
      return await createUser(auth);
    } catch (error: any) {
      const errorObject = parseApiError(error);

      if ((["USER0001", "USER0002"] as any[]).includes(errorObject?.errorCode)) {
        setIsLoading(false);
        return alert(
          "We've currently reached our maximum number of beta users " +
            "and are closing registration temporarily. " +
            "Join our waitlist on goodcash.com to get notified when we open up to new users!"
        );
      }

      trackEvent({ event: ETrackEvent.USER_LOGGED_IN_FAILED });
      redirectToGenericErrorPage();
    }
  }, [auth, redirectToGenericErrorPage]);

  const onContinue = useCallback(async () => {
    const user = await confirmPhone();
    if (!user) return;

    const token = await user.getIdToken();
    const onboardingStatePromise = getUserOnboarding(token).catch(() => null);
    const gcUser = await getUser(token).catch(userCreationHandler);

    if (gcUser && gcUser.id) {
      setUser(gcUser);
      await init(gcUser.id);
      setUserId(gcUser?.id);
      setUserProperties({
        ...(userSession?.fbc && { fbc: userSession?.fbc }),
        ...(userSession?.fbp && { fbp: userSession?.fbp }),
        ...(navigator.userAgent && { user_agent: navigator.userAgent }),
      });
      trackEvent({ event: ETrackEvent.USER_LOGGED_IN_SUCCESSFULLY });

      switch (gcUser?.state) {
        case "BLOCKED":
          return setIsUserBlocked(true);
        case "DELETED":
          return redirectToGenericErrorPage();

        case "LIVE":
          return push(onboardingStepToPageMap.NEW_CARD_ON_THE_WAY);
      }

      const onboardingState = await onboardingStatePromise;

      if (onboardingState) {
        mergeOnboardingState(onboardingState);

        if (onboardingState.onboardingStep) {
          return push(onboardingStepToPageMap[onboardingState.onboardingStep]);
        }
      }

      const plaidIdvEnabled = await isFeatureEnabled(gcUser.id, EFeature.PLAID_UI_IDV, true);
      const targetSept = plaidIdvEnabled ? "KYC" : "CONTACT_INFO";

      setOnboardingStep(targetSept);
      patchUserOnboarding({
        firstName,
        lastName,
        phone,
        email,
        user: gcUser,
        onboardingStep: targetSept,
        onboardingOperationsMap: { userCreated: true },
        plan: hardcodedPlan.id,
      });
      setOnboardingOperationsMap((prev) => ({ ...prev, userCreated: true }));
      push(onboardingStepToPageMap[targetSept]);
    }
  }, [
    confirmPhone,
    userCreationHandler,
    redirectToGenericErrorPage,
    setUser,
    userSession?.fbc,
    userSession?.fbp,
    setIsUserBlocked,
    push,
    mergeOnboardingState,
    setOnboardingStep,
    firstName,
    lastName,
    phone,
    email,
    setOnboardingOperationsMap,
  ]);

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "Done") {
      inputRef.current?.blur();
    }
  };

  return (
    <OnboardingLayout>
      <Title>Verify your phone number</Title>
      <SubTitle>A text message with a verification code has been sent to {phone}.</SubTitle>

      <FormControlText
        inputRef={(ref) => (inputRef.current = ref)}
        className={`tracking-[0.3em] ${
          isOtpInvalid ? "border-[1px] border-solid border-red-600" : ""
        }`}
        label="Verification code"
        value={codeMask}
        onChange={(e) => {
          setIsOtpInvalid(false);
          setCodeMask(e.target.value);
          setCode(e.target.value.replace(/\_/g, ""));
        }}
        placeholder="------"
        maskChar={null}
        inputMask="999999"
        inputMode="numeric"
        onKeyDown={handleKeyPress}
        error={isOtpInvalid ? "Code entered was incorrect, please try again" : false}
      />

      <div className="my-12 flex gap-4 flex-col sm:flex-row">
        <Button onClick={onContinue} isLoading={isLoading}>
          Continue
        </Button>
        <Button disabled={seconds !== 0} variant="text" onClick={resentCode}>
          Resend code{seconds !== 0 ? ` in 0:${seconds.toString().padStart(2, "0")}` : ""}
        </Button>
      </div>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
