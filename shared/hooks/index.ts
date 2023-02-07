"use-client";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useGlobal } from "../context/global";
import { useOnboarding } from "../context/onboarding";

export const useVerifyPageGuard = () => {
  const { confirmationResult } = useGlobal();
  const { indexPageIsValid } = useOnboarding();
  const { replace } = useRouter();

  useEffect(() => {
    if (!indexPageIsValid || !confirmationResult) replace("/onboarding");
  }, [indexPageIsValid, confirmationResult, replace]);

  return indexPageIsValid && !!confirmationResult;
};

export const usePlanPageGuard = () => {
  const { indexPageIsValid, phoneVerified } = useOnboarding();
  const { replace } = useRouter();

  useEffect(() => {
    if (!indexPageIsValid) replace("/onboarding");
    else if (!phoneVerified) replace("/onboarding/verify");
  }, [indexPageIsValid, phoneVerified, replace]);

  return indexPageIsValid && phoneVerified;
};

export const useContactInfoGuard = () => {
  const { indexPageIsValid, phoneVerified, plan } = useOnboarding();
  const { replace } = useRouter();

  useEffect(() => {
    if (!indexPageIsValid) replace("/onboarding");
    else if (!phoneVerified) replace("/onboarding/verify");
    else if (!plan) replace("/onboarding/plan");
  }, [indexPageIsValid, phoneVerified, plan, replace]);

  return indexPageIsValid && phoneVerified && !!plan;
};

export const useConnectBankAccountGuard = () => {
  const { indexPageIsValid, phoneVerified, plan, contactInfoPageIsValid } = useOnboarding();
  const { replace } = useRouter();

  useEffect(() => {
    if (!indexPageIsValid) replace("/onboarding");
    else if (!phoneVerified) replace("/onboarding/verify");
    else if (!plan) replace("/onboarding/plan");
    else if (!contactInfoPageIsValid) replace("/onboarding/contact-info");
  }, [indexPageIsValid, phoneVerified, plan, contactInfoPageIsValid, replace]);

  return indexPageIsValid && phoneVerified && !!plan && contactInfoPageIsValid;
};

export const useLastPageGuard = () => {
  const { indexPageIsValid, phoneVerified, plan, contactInfoPageIsValid, plaid } = useOnboarding();
  const { replace } = useRouter();

  useEffect(() => {
    if (!indexPageIsValid) replace("/onboarding");
    else if (!phoneVerified) replace("/onboarding/verify");
    else if (!plan) replace("/onboarding/plan");
    else if (!contactInfoPageIsValid) replace("/onboarding/contact-info");
    else if (!plaid) replace("/onboarding/connect-bank-account");
  }, [indexPageIsValid, phoneVerified, plan, contactInfoPageIsValid, plaid, replace]);

  return indexPageIsValid && phoneVerified && !!plan && contactInfoPageIsValid && !!plaid;
};

export const canUseDOM = () =>
  !!(typeof window !== "undefined" && window.document && window.document.createElement);

export const redirectIfServerSideRendered = (to = "/onboarding") => {
  return {
    ...(canUseDOM()
      ? {
          redirect: {
            permanent: false,
            destination: to,
          },
        }
      : { props: {} }),
  };
};

export const useConfirmUnload = () => {
  useEffect(() => {
    window.onbeforeunload = () => confirm();

    return () => {
      window.onbeforeunload = null;
    };
  }, []);
};
