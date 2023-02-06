import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import CheckBox from "@/components/CheckBox";
import FormControlText from "@/components/form-control/FormControlText";
import OnboardingLayout from "@/components/OnboardingLayout";
import { useOnboarding } from "@/shared/onboarding/context";
import { useConfirmUnload } from "@/shared/hooks";
import Title from "@/components/Title";
import SubTitle from "@/components/SubTitle";

export default function OnboardingIndexPage() {
  useConfirmUnload();

  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    setPhone,
    email,
    setEmail,
    agreedToTosAndPp,
    setAgreedToTosAndPp,
    indexPageIsValid,
  } = useOnboarding();

  const [phoneMask, setPhoneMask] = useState("");

  const { push } = useRouter();

  const onContinue = useCallback(() => {
    if (!indexPageIsValid) return;

    push("/onboarding/verify");
  }, [indexPageIsValid, push]);

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

      <CheckBox checked={agreedToTosAndPp} onChange={setAgreedToTosAndPp.bind(null, (v) => !v)}>
        By continuing, you agree to GoodCash’s <a href="#">terms of service</a> and{" "}
        <a href="#">privacy policy</a>
      </CheckBox>

      <Button disabled={!indexPageIsValid} onClick={onContinue}>
        Continue
      </Button>
    </OnboardingLayout>
  );
}
