import { useCallback, useEffect, useState } from "react";
import OnboardingLayout from "@/components/OnboardingLayout";
import { useConfirmUnload } from "@/shared/hooks";
import { ELocalStorageKeys, EScreenEventTitle } from "../../../utils/types";
import useTrackPage from "../../../shared/hooks/useTrackPage";
import Loader from "@/components/Loader";
import { verifyFundingCard } from "@/shared/http/services/debitCard";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useOnboarding } from "@/shared/context/onboarding";
import { EStepStatus } from "@/shared/types";
import { onAfterConfirm } from "@/components/CardForm";
import { getUserInfoFromCache } from "@/shared/http/util";

export default function OnboardingCardVerificationPage({ params }: Props) {
  useConfirmUnload();
  useTrackPage(EScreenEventTitle.CARD_VERIFICATION);

  const [isLoaded, setIsLoaded] = useState(false);
  const {
    setOnboardingOperationsMap,
    setOnboardingStep,
    onboardingStepHandler,
    mergeOnboardingStateHandler,
  } = useOnboarding();

  const handler = useCallback(async () => {
    try {
      const cardVerificationDataString = localStorage.getItem(
        ELocalStorageKeys.CARD_VERIFICATION_DATA
      );

      let data: {
        paymentIntentId: string;
        paymentMethodId: string;
        paymentIntentClientSecret: string;
      } | null = null;

      if (cardVerificationDataString) data = JSON.parse(cardVerificationDataString);

      const cardVerificationPayload = {
        paymentIntentId: params.setup_intent ?? data?.paymentIntentId,
        paymentMethodId: data?.paymentMethodId as string,
        paymentIntentClientSecret:
          params.setup_intent_client_secret ?? data?.paymentIntentClientSecret,
      };

      if (params.redirect_status !== "succeeded") throw new Error("Setup confirmation failed");

      await verifyFundingCard(cardVerificationPayload);

      onAfterConfirm({ onboardingStepHandler, setOnboardingOperationsMap, setOnboardingStep });
    } catch (error) {
      onboardingStepHandler(EStepStatus.FAILED);
    }
  }, [params, onboardingStepHandler, setOnboardingOperationsMap, setOnboardingStep]);

  useEffect(() => {
    const cachedUserInfo = getUserInfoFromCache();
    if (cachedUserInfo?.auth_token)
      mergeOnboardingStateHandler(cachedUserInfo?.auth_token).then(() => setIsLoaded(true));
  }, [mergeOnboardingStateHandler]);

  useEffect(() => {
    if (isLoaded) handler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  return (
    <OnboardingLayout skipGuard>
      <Loader />
    </OnboardingLayout>
  );
}

export const getServerSideProps: ServerSideProps = async (context) => {
  const searchParams = new URLSearchParams(context.req.url?.split("?").pop());

  const params = [...searchParams.entries()].reduce(
    (p, [key, value]) => ((p[key as keyof QueryParams] = value), p),
    {} as any as QueryParams
  );

  return { props: { params } };
};

interface QueryParams {
  setup_intent: string;
  setup_intent_client_secret: string;
  redirect_status: string;
}

type Props = InferGetServerSidePropsType<ServerSideProps>;

type ServerSideProps = GetServerSideProps<{
  params: QueryParams;
}>;
