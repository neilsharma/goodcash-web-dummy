import { KeyboardEvent, useCallback, useRef, useState } from "react";
import { signInWithPhoneNumber } from "firebase/auth";
import { useTimer } from "react-timer-hook";
import Button from "@/components/Button";
import FormControlText from "@/components/form-control/FormControlText";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import { useOnboarding } from "@/shared/context/onboarding";
import { useRouter } from "next/router";
import { useGlobal } from "@/shared/context/global";
import { getUser, getUserOnboarding } from "@/shared/http/services/user";
import { onboardingStepToPageMap } from "@/shared/constants";
import { EScreenEventTitle, ETrackEvent } from "../../utils/types";
import useTrackPage from "../../shared/hooks/useTrackPage";
import { setUserId, trackEvent } from "../../utils/analytics/analytics";

export default function OnboardingVerifyPage() {
  useConfirmUnload();
  let inputRef = useRef<HTMLInputElement | null>(null);

  useTrackPage(EScreenEventTitle.VERIFY_SCREEN);

  const { confirmationResult, setConfirmationResult, resetAuth } = useGlobal();
  const {
    setIsUserBlocked,
    setOnboardingStep,
    phone,
    setPhoneVerified,
    mergeOnboardingState,
    redirectToGenericErrorPage,
  } = useOnboarding();
  const { push } = useRouter();

  const [code, setCode] = useState("");
  const [codeMask, setCodeMask] = useState("");
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
    } catch (e) {
      redirectToGenericErrorPage();
    }
  }, [setPhoneVerified, confirmationResult, code, redirectToGenericErrorPage]);

  const onContinue = useCallback(async () => {
    const user = await confirmPhone();
    if (!user) {
      trackEvent({ event: ETrackEvent.USER_LOGGED_IN_FAILED });
      return redirectToGenericErrorPage();
    }

    const token = await user.getIdToken();
    const onboardingStatePromise = getUserOnboarding(token).catch(() => null);
    const gcUser = await getUser(token).catch(() =>
      trackEvent({ event: ETrackEvent.USER_LOGGED_IN_FAILED })
    );

    if (gcUser && gcUser.id) {
      setUserId(gcUser?.id);
      trackEvent({ event: ETrackEvent.USER_LOGGED_IN_SUCCESSFULLY });
    }

    switch (gcUser?.state) {
      case "BLOCKED":
        return setIsUserBlocked(true);
      case "DELETED":
        return redirectToGenericErrorPage();

      case "LIVE":
        return push(onboardingStepToPageMap.APPLICATION_COMPLETE);
    }

    const onboardingState = await onboardingStatePromise;

    if (onboardingState) {
      mergeOnboardingState(onboardingState);

      if (onboardingState.onboardingStep) {
        return push(
          onboardingStepToPageMap[onboardingState.onboardingStep] ??
            onboardingStepToPageMap.PLAN_SELECTION_AND_USER_CREATION
        );
      }
    }

    setOnboardingStep("PLAN_SELECTION_AND_USER_CREATION");
    return push(onboardingStepToPageMap.PLAN_SELECTION_AND_USER_CREATION);
  }, [
    setIsUserBlocked,
    push,
    confirmPhone,
    setOnboardingStep,
    mergeOnboardingState,
    redirectToGenericErrorPage,
  ]);

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    // alert(inputRef.current?.focus);
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
        className="tracking-[0.3em]"
        label="Verification code"
        value={codeMask}
        onChange={(e) => {
          setCodeMask(e.target.value);
          setCode(e.target.value.replace(/\_/g, ""));
        }}
        placeholder="------"
        maskChar={null}
        inputMask="999999"
        inputMode="numeric"
        onKeyDown={handleKeyPress}
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
