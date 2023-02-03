"use-client";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useOnboarding } from "../onboarding/context";

export const useVerifyPageGuard = () => {
  const { indexPageIsValid } = useOnboarding();
  const { replace } = useRouter();

  useEffect(() => {
    if (!indexPageIsValid) replace("/onboarding");
  }, [indexPageIsValid, replace]);

  return indexPageIsValid;
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
