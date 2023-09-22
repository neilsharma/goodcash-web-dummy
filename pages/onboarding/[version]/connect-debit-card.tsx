import { Elements } from "@stripe/react-stripe-js";
import Image from "next/image";
import CardForm from "../../../components/CardForm";
import OnboardingLayout from "../../../components/OnboardingLayout";
import { useConfirmUnload } from "../../../shared/hooks";
import Title from "../../../components/Title";
import SubTitle from "../../../components/SubTitle";
import { useOnboarding } from "../../../shared/context/onboarding";
import { sharpGroteskFont } from "../../../utils/utils";
import { useCallback, useEffect, useState } from "react";
import { defaultPlanId, freePlanId, hardcodedPlans } from "../../../shared/constants";
import { EFeature, isFeatureEnabled } from "../../../shared/feature";
import { getUserInfoFromCache } from "../../../shared/http/util";
import { resolveText } from "../../../utils/types";

export default function AddCard() {
  useConfirmUnload();
  const { stripe } = useOnboarding();
  const [dynamicPlanId, setDynamicPlanId] = useState(defaultPlanId);
  const { user } = useOnboarding();

  const fetchDynamicSubscriptionFlag = useCallback(async () => {
    try {
      const cachedUserInfo = getUserInfoFromCache();
      const userId = cachedUserInfo?.userId || user?.id;

      if (userId) {
        const dynamicPlan = await isFeatureEnabled(
          userId,
          EFeature.DYNAMIC_SUBSCRIPTION_PLAN_FUNDING_CARD,
          defaultPlanId
        );
        setDynamicPlanId(dynamicPlan);
      } else {
        setDynamicPlanId(defaultPlanId);
      }
    } catch {}
  }, [user?.id]);

  useEffect(() => {
    fetchDynamicSubscriptionFlag();
  }, [fetchDynamicSubscriptionFlag]);

  return (
    <OnboardingLayout>
      <Title>Ready to join</Title>
      <Title>GoodCash?</Title>
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
      <SubTitle className="mb-5">
        Enter the debit card details that you’ll use to pay for your subscription and fund your
        GoodCash spending.
      </SubTitle>
      <Elements
        stripe={stripe}
        options={{
          fonts: [sharpGroteskFont],
        }}
      >
        <CardForm />
      </Elements>
    </OnboardingLayout>
  );
}
