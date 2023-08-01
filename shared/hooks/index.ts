"use-client";

import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useOnboarding } from "../context/onboarding";
import { CachedUserInfo, ETrackEvent } from "../../utils/types";
import { getUserInfoFromCache } from "../http/util";
import { trackEvent } from "../../utils/analytics/analytics";

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
    const handleBeforeUnload = (e: any) => {
      e.preventDefault();
      const currentURL = window.location.href;
      const keywordsRegex = /connect-bank-account|kyc/;
      const containsKeyword = keywordsRegex.test(currentURL);
      if (containsKeyword) {
        trackEvent({ event: ETrackEvent.USER_CLOSED_BROWSER_TAB, options: { url: currentURL } });
      }
      return (e.returnValue = "Are you sure you want to leave?");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
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
