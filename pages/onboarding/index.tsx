import Button from "@/components/Button";
import CheckBox from "@/components/CheckBox";
import FormControl from "@/components/FormControl";
import OnboardingLayout from "@/components/OnboardingLayout";
import { useOnboarding } from "@/shared/context/onboarding";
import Head from "next/head";

export default function OnboardingIndexPage() {
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

  return (
    <>
      <Head>
        <title>GoodCash App Onboarding</title>
      </Head>
      <OnboardingLayout>
        <h1 className="font-kansasNewSemiBold text-4xl mb-4 text-boldText">
          Welcome to GoodCash
        </h1>
        <p className="font-sharpGroteskBook text-lg text-text">
          Grow your credit with your existing bank account and the GoodCash
          card. No interest, no credit checks, no surprises.
        </p>

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

        <CheckBox
          checked={agreedToTosAndPp}
          onChange={setAgreedToTosAndPp.bind(null, (v) => !v)}
        >
          By continuing, you agree to GoodCash’s{" "}
          <a href="#">terms of service</a> and <a href="#">privacy policy</a>
        </CheckBox>

        <Button disabled={!indexPageIsValid}>Continue</Button>
      </OnboardingLayout>
    </>
  );
}
