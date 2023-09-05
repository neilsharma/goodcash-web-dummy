import Button from "@/components/Button";
import OnboardingLayout from "@/components/OnboardingLayout";
import Title from "@/components/Title";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import CheckBox from "../../../components/CheckBox";
import {
  OnboardingFlowName,
  OnboardingFlowVersionsMap,
  bankPrivacyPolicyUrl,
  cardHolderAgreementUrl,
  defaultPlanId,
  eSignConsentUrl,
  freePlanId,
  hardcodedPlans,
  privacyPolicyUrl,
  termsOfServiceUrl,
} from "../../../shared/constants";
import { useOnboarding } from "../../../shared/context/onboarding";
import { EFeature, isFeatureEnabled } from "../../../shared/feature";
import useTrackPage from "../../../shared/hooks/useTrackPage";
import { getUserInfoFromCache } from "../../../shared/http/util";
import { EStepStatus } from "../../../shared/types";
import { EScreenEventTitle, resolveText } from "../../../utils/types";

export default function OnboardingReadyToJoinPage() {
  useConfirmUnload();

  useTrackPage(EScreenEventTitle.READY_TO_JOIN);

  const { push } = useRouter();
  const [electronicDisclosureCheckbox, setElectronicDisclosureCheckbox] = useState(false);
  const [recurringAuthorizationCheckbox, setRecurringAuthorizationCheckbox] = useState(false);
  const [cardholderAgreementCheckbox, setCardholderAgreementCheckbox] = useState(false);
  const [dynamicPlanId, setDynamicPlanId] = useState(defaultPlanId);
  const [isLoading, setIsLoading] = useState(false);
  const { user, version, onboardingStepHandler } = useOnboarding();
  const isButtonDisabled =
    !electronicDisclosureCheckbox ||
    !recurringAuthorizationCheckbox ||
    !cardholderAgreementCheckbox;

  const fetchDynamicSubscriptionFlag = useCallback(async () => {
    try {
      const cachedUserInfo = getUserInfoFromCache();
      const userId = cachedUserInfo?.userId || user?.id;

      const onboardingFlowName = OnboardingFlowVersionsMap[version];

      if (userId) {
        const dynamicPlan = await isFeatureEnabled(
          userId,
          onboardingFlowName === OnboardingFlowName.DEBIT_CARD_FUNDING
            ? EFeature.DYNAMIC_SUBSCRIPTION_PLAN_FUNDING_CARD
            : EFeature.DYNAMIC_SUBSCRIPTION_PLAN,
          defaultPlanId
        );
        setDynamicPlanId(dynamicPlan);
      } else {
        setDynamicPlanId(defaultPlanId);
      }
    } catch (error) {
      console.error("Error fetching monthly subscription plan:", error);
    }
  }, [user?.id, version]);

  useEffect(() => {
    fetchDynamicSubscriptionFlag();
  }, [fetchDynamicSubscriptionFlag]);

  return (
    <OnboardingLayout>
      <Title className="m-0">Ready to join</Title>
      <Title className="m-0">GoodCash?</Title>
      {dynamicPlanId != freePlanId ? (
        <div className=" mt-8 h-28 rounded-2xl bg-bgLight text-boldText flex items-center gap-4 p-6">
          <Image
            src="/img/goodcash-card-circle.png"
            alt="card"
            width={56}
            height={56}
            priority={true}
          />
          <div>
            <p className="font-kansasNew text-3xl font-bold">
              ${hardcodedPlans[dynamicPlanId as keyof typeof hardcodedPlans].price} per{" "}
              {resolveText(hardcodedPlans[dynamicPlanId as keyof typeof hardcodedPlans].frequency)}
            </p>
            <p className="font-sharpGroteskBook text-xs">Earn rewards and build credit</p>
          </div>
        </div>
      ) : null}
      <CheckBox
        checked={electronicDisclosureCheckbox}
        onChange={setElectronicDisclosureCheckbox.bind(null, (v) => !v)}
        containerProps={{ className: "mt-8" }}
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
        containerProps={{ className: "mt-10" }}
      >
        I agree to the optional GoodCash Recurring ACH Authorization and I agree to turn on autopay.
      </CheckBox>
      <CheckBox
        checked={cardholderAgreementCheckbox}
        onChange={setCardholderAgreementCheckbox.bind(null, (v) => !v)}
        containerProps={{ className: "mt-10" }}
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
      <div className="">
        <Button
          disabled={isButtonDisabled}
          isLoading={isLoading}
          onClick={() => {
            setIsLoading(true);
            onboardingStepHandler(EStepStatus.COMPLETED);
          }}
        >
          Continue
        </Button>
      </div>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
