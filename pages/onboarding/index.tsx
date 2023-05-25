import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import FormControlText from "@/components/form-control/FormControlText";
import OnboardingLayout from "@/components/OnboardingLayout";
import { useOnboarding } from "@/shared/context/onboarding";
import { useConfirmUnload } from "@/shared/hooks";
import Title from "@/components/Title";
import SubTitle from "@/components/SubTitle";
import { signInWithPhoneNumber } from "firebase/auth";
import { useGlobal } from "@/shared/context/global";
import { onboardingStepToPageMap } from "@/shared/constants";
import { trackEvent, trackPage, trackerInitializer } from "../../utils/analytics/analytics";
import { EScreenEventTitle, ETrackEvent } from "../../utils/types";
import FormControlSelect from "../../components/form-control/FormControlSelect";
import { EUsaStates } from "../../shared/types";

export default function OnboardingIndexPage() {
  useConfirmUnload();
  const { auth, recaptchaVerifier, setConfirmationResult, analytics } = useGlobal();
  const {
    setState,
    redirectToStateNotSupportedPage,
    userStateCoverageMap,
    setOnboardingStep,
    phone,
    setPhone,
    email,
    setEmail,
    indexPageIsValid,
  } = useOnboarding();
  const [phoneMask, setPhoneMask] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stateMask, setStateMask] = useState<{ value: string; label: string } | null>(null);
  const [dimBackground, setDimBackground] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    (async function () {
      if (analytics) {
        await trackerInitializer(analytics);
      }
      trackPage(EScreenEventTitle.ONBOARDING);
    })();
  }, [analytics]);

  const onContinue = useCallback(async () => {
    const stateValue = stateMask?.value;

    if (!indexPageIsValid) {
      return;
    }

    if (stateValue && userStateCoverageMap && !userStateCoverageMap[stateValue]) {
      trackEvent({
        event: ETrackEvent.USER_STATE_VALIDATION_FAILED,
        options: { phone, email, state: stateMask },
      });
      redirectToStateNotSupportedPage();
      return;
    }

    setIsLoading(true);
    try {
      setDimBackground(true);
      const res = await signInWithPhoneNumber(auth!, phone, recaptchaVerifier!);
      recaptchaVerifier?.clear();
      setDimBackground(false);

      setConfirmationResult(res);
      setOnboardingStep("PHONE_VERIFICATION");

      push(onboardingStepToPageMap.PHONE_VERIFICATION);
    } catch (e) {
      setIsLoading(false);
      setDimBackground(false);
    }
  }, [
    stateMask,
    indexPageIsValid,
    userStateCoverageMap,
    phone,
    email,
    redirectToStateNotSupportedPage,
    auth,
    recaptchaVerifier,
    setConfirmationResult,
    setOnboardingStep,
    push,
  ]);

  return (
    <OnboardingLayout skipGuard>
      {dimBackground && <div className="fixed top-0 left-0 h-[100vh] w-[100vw] bg-black/70 z-10" />}
      <Title>Welcome to GoodCash</Title>
      <SubTitle>
        Grow your credit with your existing bank account and the GoodCash card. No interest, no
        credit checks, no surprises.
      </SubTitle>
      <FormControlText
        value={phoneMask}
        onChange={(e) => {
          setPhoneMask(e.target.value);
          setPhone(e.target.value.replace(/\s|\_/g, ""));
        }}
        label="Phone number"
        type="tel"
        maskChar={null}
        placeholder="+1 999 999 9999"
        inputMask="+1 999 999 9999"
      />
      <FormControlText
        value={email}
        onChange={(e) => setEmail(e.target.value.trim())}
        type="email"
        label="Email address"
        placeholder="john@example.com"
      />

      <FormControlSelect
        options={Object.keys(EUsaStates).map((e) => ({
          value: EUsaStates[e as keyof typeof EUsaStates],
          label: e,
        }))}
        value={stateMask}
        onChange={(v) => {
          setStateMask(v as any);
          setState(((v as any)?.value || "") as EUsaStates | "");
        }}
        label="State"
        placeholder="State"
        noOptionsMessage={() => null}
        containerProps={{ className: "m-0" }}
      />
      <Button
        className="mt-12"
        isLoading={isLoading}
        disabled={!indexPageIsValid}
        onClick={onContinue}
      >
        Continue
      </Button>

      <p className="font-sharpGroteskBook text-thinText text-sm my-6">
        By continuing, you agree to GoodCash’s{" "}
        <a href="https://bit.ly/goodcash-terms" rel="noreferrer" target="_blank">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="https://bit.ly/goodcash-privacy" rel="noreferrer" target="_blank">
          Privacy Policy
        </a>
      </p>
    </OnboardingLayout>
  );
}
