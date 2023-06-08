import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import LoadingPDFIndicator from "@/components/LoadingPDFIndicator";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { useOnboarding } from "@/shared/context/onboarding";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import {
  createPierFacility,
  createPierLoanAgreement,
  patchUserOnboarding,
  signPierLoanAgreement,
} from "@/shared/http/services/user";
import { onboardingStepToPageMap } from "@/shared/constants";
import { trackPage } from "../../utils/analytics/analytics";
import { EScreenEventTitle } from "../../utils/types";
import useTrackPage from "../../shared/hooks/useTrackPage";

export default function ThanksForJoining() {
  useConfirmUnload();
  useTrackPage(EScreenEventTitle.THANKS_FOR_JOINING);

  const { push } = useRouter();

  return (
    <OnboardingLayout>
      <Title className="text-primary text-center">Thanks for joining GoodCash!</Title>
      <SubTitle className="mt-8 text-center text-boldText">
        As a gift for being one of our first beta users, we’re waiving your GoodCash fee.
      </SubTitle>
      <SubTitle className="mt-8 text-center text-boldText">
        Therefore, we will not charge you a fee for using GoodCash.
      </SubTitle>

      <Button className="mt-12" onClick={() => push(onboardingStepToPageMap.NEW_CARD_ON_THE_WAY)}>
        Continue
      </Button>

      <p className="font-sharpGroteskBook text-boldText text-sm my-6 text-center">
        If you have any comments or questions, we’d love to hear from you. Just email us at
        support@goodcash.com
      </p>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
