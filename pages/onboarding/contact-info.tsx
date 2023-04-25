import { KeyboardEvent, useCallback, useRef, useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import CheckBox from "@/components/CheckBox";
import FormControlText from "@/components/form-control/FormControlText";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import { useOnboarding } from "@/shared/context/onboarding";
import { EUsaStates } from "@/shared/types";
import FormControlSelect from "@/components/form-control/FormControlSelect";
import {
  patchUserOnboarding,
  updateTaxInfo,
  updateUserAddress,
  updateUserIdentityBasic,
} from "@/shared/http/services/user";
import { onboardingStepToPageMap } from "@/shared/constants";
import { EScreenEventTitle } from "../../utils/types";
import useTrackPage from "../../shared/hooks/useTrackPage";

export default function OnboardingContactInfoPage() {
  useConfirmUnload();
  let inputRef = useRef<HTMLInputElement | null>(null);

  useTrackPage(EScreenEventTitle.CONTACT_INFO_SCREEN);

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "Done") {
      inputRef.current?.blur();
    }
  };

  const {
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    setOnboardingStep,
    firstName,
    lastName,
    email,
    dateOfBirth,
    setDateOfBirth,
    legalAddress,
    setLegalAddress,
    aptNumber,
    setAptNumber,
    city,
    setCity,
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
    is18YearsOld,
    contactInfoPageIsValid,
    redirectToGenericErrorPage,
  } = useOnboarding();
  const { push } = useRouter();

  const [dateOfBirthMask, setDateOfBirthMask] = useState("");
  const [ssnMask, setSsnMask] = useState("");
  const [stateMask, setStateMask] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onContinue = useCallback(async () => {
    if (!contactInfoPageIsValid) return;

    try {
      setIsLoading(true);

      if (!onboardingOperationsMap.userAddressCreated) {
        await updateUserAddress({
          address_line_1: legalAddress,
          ...(aptNumber ? { address_line_2: aptNumber } : null),
          city,
          country: "USA",
          postal_code: zipCode,
          state,
        });

        setOnboardingOperationsMap((p) => ({ ...p, userAddressCreated: true }));
        patchUserOnboarding({ onboardingOperationsMap: { userAddressCreated: true } });
      }

      if (!onboardingOperationsMap.userIdentityBasisCreated) {
        await updateUserIdentityBasic({
          birth_date: dateOfBirth?.toISOString(),
          email_address: email,
          first_name: firstName,
          last_name: lastName,
        });

        setOnboardingOperationsMap((p) => ({ ...p, userIdentityBasisCreated: true }));
        patchUserOnboarding({ onboardingOperationsMap: { userIdentityBasisCreated: true } });
      }

      if (!onboardingOperationsMap.userTaxInfoIsSet) {
        await updateTaxInfo({ social_security_number: ssnMask });

        setOnboardingOperationsMap((p) => ({ ...p, userTaxInfoIsSet: true }));
        patchUserOnboarding({
          agreedToCardHolderAgreement,
          agreedToAutopay,
          agreedToTermsOfService,
          onboardingOperationsMap: { userTaxInfoIsSet: true },
          onboardingStep: "BANK_ACCOUNT_CONNECTION",
        });
      }

      setOnboardingStep("BANK_ACCOUNT_CONNECTION");
      push(onboardingStepToPageMap.BANK_ACCOUNT_CONNECTION);
    } catch (e) {
      redirectToGenericErrorPage();
    }
  }, [
    agreedToCardHolderAgreement,
    agreedToAutopay,
    agreedToTermsOfService,
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    setOnboardingStep,
    push,
    contactInfoPageIsValid,
    legalAddress,
    aptNumber,
    city,
    zipCode,
    state,
    dateOfBirth,
    email,
    firstName,
    lastName,
    ssnMask,
    setIsLoading,
    redirectToGenericErrorPage,
  ]);

  return (
    <OnboardingLayout>
      <Title>A few more things...</Title>
      <SubTitle>GoodCash is required by law to collect this information.</SubTitle>

      <FormControlText
        value={dateOfBirthMask}
        onChange={(e) => {
          setDateOfBirthMask(e.target.value);

          if (e.target.value === "" || e.target.value.includes("_")) return setDateOfBirth(null);

          const date = new Date();
          const [month, day, year] = e.target.value.replace(/\s/g, "").split("/");
          date.setMonth(Number(month) - 1);
          date.setDate(Number(day));
          date.setFullYear(Number(year));

          setDateOfBirth(date);
        }}
        label="Date of birth"
        inputMask="99 / 99 / 9999"
        inputMode="numeric"
        placeholder="MM / DD / YYYY"
        error={!is18YearsOld && dateOfBirth ? "You must be 18 years old to use GoodCash." : false}
      />

      <FormControlText
        value={legalAddress}
        onChange={(e) => setLegalAddress(e.target.value)}
        label="Legal address"
        labelDescription="PO boxes are not accepted"
        placeholder="Street address"
        description="Your GoodCash card will be shipped here"
      />

      <FormControlText
        value={aptNumber}
        onChange={(e) => setAptNumber(e.target.value)}
        label="Apt/suite number"
        placeholder="Optional"
      />

      <FormControlText
        value={city}
        onChange={(e) => setCity(e.target.value)}
        label="City"
        placeholder="City"
      />

      <div className="flex gap-6 my-7">
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

        <FormControlText
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          label="Zipcode"
          placeholder="12345"
          type="number"
          containerProps={{ className: "m-0" }}
        />
      </div>

      <FormControlText
        inputRef={(ref) => (inputRef.current = ref)}
        onKeyDown={handleKeyPress}
        value={ssnMask}
        onChange={(e) => {
          setSsnMask(e.target.value);

          if (e.target.value === "" || e.target.value.includes("_")) return setSsn("");

          setSsn(e.target.value.replace(/\-/g, ""));
        }}
        label="Social security number"
        placeholder="XXX-XX-XXXX"
        inputMask="999-99-9999"
        inputMode="numeric"
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

      <Button
        className="my-7"
        disabled={!contactInfoPageIsValid}
        isLoading={isLoading}
        onClick={onContinue}
      >
        Continue
      </Button>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
