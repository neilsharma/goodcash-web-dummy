"use-client";

import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useOnboarding } from "../context/onboarding";
import { CachedUserInfo } from "../../utils/types";
import { getUserInfoFromCache } from "../http/util";

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
  const cachedUserInfo = useRef<CachedUserInfo | null>(null);

  useEffect(() => {
    cachedUserInfo.current = getUserInfoFromCache();
    if (!indexPageIsValid && !skipGuard && !cachedUserInfo.current) push("/onboarding");
  }, [indexPageIsValid, skipGuard, push]);

  if (cachedUserInfo.current) {
    return true;
  }
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

export const useConfirmIsOAuthRedirect = () => {
  const [isPlaidOAuthRedirect, setIsPlaidOAuthRedirect] = useState(false);
  useEffect(() => {
    setIsPlaidOAuthRedirect(window.location.href.includes("oauth_state_id="));
  }, []);
  return isPlaidOAuthRedirect;
};
