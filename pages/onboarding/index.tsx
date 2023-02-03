import { useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import CheckBox from "@/components/CheckBox";
import FormControl from "@/components/FormControl";
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
    phone,
    setPhone,
    email,
    setEmail,
    agreedToTosAndPp,
    setAgreedToTosAndPp,
    indexPageIsValid,
  } = useOnboarding();

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
        <FormControl
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          label="First Name"
          placeholder="John"
          containerProps={{ className: "m-0" }}
        />
        <FormControl
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          label="Last Name"
          placeholder="Smith"
          containerProps={{ className: "m-0" }}
        />
      </div>

      <FormControl
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value.replace(/[^0-9\+]/g, ""));
        }}
        label="Phone number"
        placeholder="+12223334445"
      />

      <FormControl
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
