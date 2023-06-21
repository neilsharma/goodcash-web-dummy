import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import { useOnboarding } from "@/shared/context/onboarding";
import Image from "next/image";
import { useGlobal } from "@/shared/context/global";
import { patchUserOnboarding } from "@/shared/http/services/user";
import { hardcodedPlan, onboardingStepToPageMap } from "@/shared/constants";
import { PlanFrequency } from "@/shared/types";
import { EScreenEventTitle, resolveText } from "../../utils/types";
import useTrackPage from "../../shared/hooks/useTrackPage";
import { EFeature, isFeatureEnabled } from "@/shared/feature";

export default function OnboardingPlanPage() {
  useConfirmUnload();

  useTrackPage(EScreenEventTitle.PLAN);

  const { push } = useRouter();
  const { auth } = useGlobal();
  const {
    firstName,
    lastName,
    phone,
    email,
    user,
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    setOnboardingStep,
    setPlan,
    setUser,
    redirectToGenericErrorPage,
  } = useOnboarding();

  const [isLoading, setIsLoading] = useState(false);

  const onContinue = useCallback(async () => {
    if (user && onboardingOperationsMap.userCreated) return push("/onboarding/contact-info");

    try {
      setPlan(hardcodedPlan.id);
      setIsLoading(true);
      const plaidIdvEnabled = user
        ? await isFeatureEnabled(user.id, EFeature.PLAID_UI_IDV, true)
        : false;
      const targetSept = plaidIdvEnabled ? "KYC" : "CONTACT_INFO";

      setOnboardingStep(targetSept);
      patchUserOnboarding({
        firstName,
        lastName,
        phone,
        email,
        user,
        onboardingStep: targetSept,
        onboardingOperationsMap: { userCreated: true },
        plan: hardcodedPlan.id,
      });
      setOnboardingOperationsMap((prev) => ({ ...prev, userCreated: true }));

      push(onboardingStepToPageMap[targetSept]);
    } catch (error: any) {
      redirectToGenericErrorPage();
    }
  }, [
    user,
    firstName,
    lastName,
    phone,
    email,
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    setPlan,
    setOnboardingStep,
    push,
    redirectToGenericErrorPage,
  ]);

  return (
    <OnboardingLayout>
      <Title>The GoodCash Plan</Title>
      <SubTitle>Build credit for the cost of a latte</SubTitle>

      <div className="my-12 h-28 rounded-2xl bg-bgLight text-boldText flex items-center gap-4 p-6">
        <Image
          src="/img/goodcash-card-circle.png"
          alt="card"
          width={56}
          height={56}
          priority={true}
        />
        <div>
          <p className="font-kansasNew text-3xl font-bold">
            ${hardcodedPlan.price} per {resolveText(hardcodedPlan.frequency)}
          </p>
          <p className="font-sharpGroteskBook text-xs">Earn rewards and build credit</p>
        </div>
      </div>

      <div className="my-12">
        <p className="font-sharpGroteskMedium text-black">With this plan you get:</p>

        {[
          "Grow your credit with every purchase",
          "Use your own bank account",
          "Use anywhere Mastercard is accepted",
        ].map((el) => (
          <div key={el} className="my-4 flex gap-3">
            <CheckMark />
            <p className="text-black">{el}</p>
          </div>
        ))}
      </div>

      <Button isLoading={isLoading} onClick={onContinue}>
        Continue
      </Button>
    </OnboardingLayout>
  );
}

const CheckMark = () => (
  <Image src="/img/logo/checkmark.svg" alt="✔" width={24} height={24} priority={true} />
);

export const getServerSideProps = redirectIfServerSideRendered;
