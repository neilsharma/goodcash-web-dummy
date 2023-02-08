import { useCallback, useState } from "react";
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

export default function OnboardingIndexPage() {
  useConfirmUnload();
  const { auth, recaptchaVerifier } = useGlobal();
  const { setConfirmationResult } = useGlobal();

  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    email,
    setEmail,
    indexPageIsValid,
  } = useOnboarding();

  const [phoneMask, setPhoneMask] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { push } = useRouter();

  const onContinue = useCallback(async () => {
    if (!indexPageIsValid) return;

    setIsLoading(true);
    try {
      const res = await signInWithPhoneNumber(auth!, phone, recaptchaVerifier!);
      recaptchaVerifier?.clear();

      setConfirmationResult(res);

      push("/onboarding/verify");
    } catch (e) {
      setIsLoading(false);
    }
  }, [auth, recaptchaVerifier, indexPageIsValid, phone, setConfirmationResult, push]);

  return (
    <OnboardingLayout>
      <Title>Welcome to GoodCash</Title>
      <SubTitle>
        Grow your credit with your existing bank account and the GoodCash card. No interest, no
        credit checks, no surprises.
      </SubTitle>
      <div className="flex gap-6 my-7">
        <FormControlText
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          label="First Name"
          placeholder="John"
          containerProps={{ className: "m-0" }}
        />
        <FormControlText
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          label="Last Name"
          placeholder="Smith"
          containerProps={{ className: "m-0" }}
        />
      </div>
      <FormControlText
        value={phoneMask}
        onChange={(e) => {
          setPhoneMask(e.target.value);
          setPhone(e.target.value.replace(/\s|\_/g, ""));
        }}
        label="Phone number"
        type="tel"
        placeholder="+1 999 999 9999"
        inputMask="+1 999 999 9999"
      />
      <FormControlText
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label="Email address"
        placeholder="john@example.com"
      />
      <p className="font-sharpGroteskBook text-thinText text-sm my-6">
        By continuing, you agree to GoodCash’s <a href="#">terms of service</a> and{" "}
        <a href="#">privacy policy</a>
      </p>

      <Button isLoading={isLoading} disabled={!indexPageIsValid} onClick={onContinue}>
        Continue
      </Button>
    </OnboardingLayout>
  );
}
