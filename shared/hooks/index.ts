"use-client";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useOnboarding } from "../context/onboarding";

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

export const useServerSideOnboardingGuard = (skipGuard = false) => {
  const { indexPageIsValid } = useOnboarding();
  const { push } = useRouter();

  useEffect(() => {
    if (!indexPageIsValid && !skipGuard) push("/onboarding");
  }, [indexPageIsValid, skipGuard, push]);

  return indexPageIsValid;
};

export const useConfirmUnload = () => {
  useEffect(() => {
    window.onbeforeunload = () => confirm();

    return () => {
      window.onbeforeunload = null;
    };
  }, []);
};
