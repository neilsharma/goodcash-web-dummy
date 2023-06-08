import Button from "@/components/Button";
import OnboardingLayout from "@/components/OnboardingLayout";
import Title from "@/components/Title";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import { useRouter } from "next/router";
import { useState } from "react";
import CheckBox from "../../components/CheckBox";
import {
  bankPrivacyPolicyUrl,
  cardHolderAgreementUrl,
  eSignConsentUrl,
  onboardingStepToPageMap,
  privacyPolicyUrl,
  termsOfServiceUrl,
} from "../../shared/constants";
import useTrackPage from "../../shared/hooks/useTrackPage";
import { EScreenEventTitle } from "../../utils/types";

export default function OnboardingReadyToJoinPage() {
  useConfirmUnload();

  useTrackPage(EScreenEventTitle.READY_TO_JOIN);

  const { push } = useRouter();
  const [electronicDisclosureCheckbox, setElectronicDisclosureCheckbox] = useState(false);
  const [recurringAuthorizationCheckbox, setRecurringAuthorizationCheckbox] = useState(false);
  const [cardholderAgreementCheckbox, setCardholderAgreementCheckbox] = useState(false);

  const isButtonDisabled =
    !electronicDisclosureCheckbox ||
    !recurringAuthorizationCheckbox ||
    !cardholderAgreementCheckbox;

  return (
    <OnboardingLayout>
      <Title className="m-0 pb-4">Ready to join GoodCash?</Title>

      <div className="overflow-y-scroll h-[40vh]">
        <CheckBox
          checked={electronicDisclosureCheckbox}
          onChange={setElectronicDisclosureCheckbox.bind(null, (v) => !v)}
          containerProps={{ className: "mt-14" }}
        >
          I have read and agree to the{" "}
          <a href={eSignConsentUrl} className="text-primary" target="_blank">
            Electronic Signature and Communication Disclosure
          </a>
          , and{" "}
          <a href={bankPrivacyPolicyUrl} className="text-primary" target="_blank">
            Partner Bank Privacy Policy
          </a>
          .
        </CheckBox>
        <CheckBox
          checked={recurringAuthorizationCheckbox}
          onChange={setRecurringAuthorizationCheckbox.bind(null, (v) => !v)}
          containerProps={{ className: "mt-14" }}
        >
          I agree to the optional GoodCash Recurring ACH Authorization and I agree to turn on
          autopay.
        </CheckBox>
        <CheckBox
          checked={cardholderAgreementCheckbox}
          onChange={setCardholderAgreementCheckbox.bind(null, (v) => !v)}
          containerProps={{ className: "mt-14" }}
        >
          I have read and agree to the{" "}
          <a href={cardHolderAgreementUrl} className="text-primary" target="_blank">
            Cardholder Agreement
          </a>
          ,{" "}
          <a href={termsOfServiceUrl} className="text-primary" target="_blank">
            GoodCash Terms of Service
          </a>
          , and{" "}
          <a href={privacyPolicyUrl} className="text-primary" target="_blank">
            Privacy Policy
          </a>
          .
        </CheckBox>
      </div>
      <div className="">
        <Button
          disabled={isButtonDisabled}
          onClick={() => push(onboardingStepToPageMap.DOC_GENERATION)}
        >
          Continue
        </Button>
      </div>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
