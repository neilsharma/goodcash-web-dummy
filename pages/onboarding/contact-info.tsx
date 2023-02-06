import Button from "@/components/Button";
import CheckBox from "@/components/CheckBox";
import FormControl from "@/components/FormControl";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import {
  redirectIfServerSideRendered,
  useConfirmUnload,
  useContactInfoGuard,
} from "@/shared/hooks";
import { useOnboarding } from "@/shared/onboarding/context";

export default function OnboardingContactInfoPage() {
  useConfirmUnload();
  const allowed = useContactInfoGuard();
  const {
    dateOfBirth,
    setDateOfBirth,
    legalAddress,
    setLegalAddress,
    aptNumber,
    setAptNumber,
    state,
    setState,
    zipCode,
    setZipCode,
    ssn,
    setSsn,
    agreedToCardHolderAgreement,
    setAgreedToCardHolderAgreement,
    agreedToAutopay,
    setAgreedToAutopay,
    agreedToTermsOfService,
    setAgreedToTermsOfService,
  } = useOnboarding();

  if (!allowed) return <OnboardingLayout />;

  return (
    <OnboardingLayout>
      <Title>A few more things...</Title>
      <SubTitle>GoodCash is required by law to collect this information.</SubTitle>

      <FormControl
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
        label="Date of birth"
        placeholder="MM / DD / YYYY"
      />

      <FormControl
        value={legalAddress}
        onChange={(e) => setLegalAddress(e.target.value)}
        label="Legal address"
        labelDescription="PO boxes are not accepted"
        placeholder="Street address"
        description="Your GoodCash card will be shipped here"
      />

      <FormControl
        value={aptNumber}
        onChange={(e) => setAptNumber(e.target.value)}
        label="Apt/suite number"
        placeholder="Optional"
      />

      <div className="flex gap-6 my-7">
        <FormControl
          value={state}
          onChange={(e) => setState(e.target.value)}
          label="State"
          placeholder="State"
          containerProps={{ className: "m-0" }}
        />

        <FormControl
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          label="Zipcode"
          placeholder="12345"
          containerProps={{ className: "m-0" }}
        />
      </div>

      <FormControl
        value={ssn}
        onChange={(e) => setSsn(e.target.value)}
        label="Social security number"
        placeholder="XXX-XXX-XXXX"
        description="Your SSN will not be shared without your permission, except as required by law. Your SSN will only be used to verify your identity. This will not affect your credit score. Your data will be encrypted and transmitted via a secure (TLS) connection."
      />

      <CheckBox
        checked={agreedToCardHolderAgreement}
        onChange={setAgreedToCardHolderAgreement.bind(null, (v) => !v)}
        containerProps={{ className: "mt-14" }}
      >
        I agree to the <a href="#">GoodCash Cardholder Agreement, Standing ACH Authorization</a>,
        and GoodCash’s <a href="a">FCRA Notice</a>.
      </CheckBox>

      <CheckBox checked={agreedToAutopay} onChange={setAgreedToAutopay.bind(null, (v) => !v)}>
        I agree to the optional GoodCash Recurring ACH Authorization and I agree to turn on autopay.
      </CheckBox>

      <CheckBox
        checked={agreedToTermsOfService}
        onChange={setAgreedToTermsOfService.bind(null, (v) => !v)}
      >
        I agree to the GoodCash Terms of Service.
      </CheckBox>

      <Button className="my-7">Continue</Button>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
