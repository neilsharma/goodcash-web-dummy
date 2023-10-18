"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useOnboarding } from "../context/onboarding";
import { CachedUserInfo, ETrackEvent } from "../../utils/types";
import { getUserInfoFromCache, navigateWithQuery } from "../http/util";
import { trackEvent } from "../../utils/analytics/analytics";
import { onboardingStepToPageMap } from "../constants";
import { useErrorContext } from "../context/error";
import { useSearchParams } from "next/navigation";

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
  const params = useSearchParams();
  const cachedUserInfo = useRef<CachedUserInfo | null>(null);
  useEffect(() => {
    const flowName = params?.get("flowName");
    const urlWithQuery = navigateWithQuery(
      flowName ?? "",
      onboardingStepToPageMap.USER_IDENTITY_COLLECTION
    );
    cachedUserInfo.current = getUserInfoFromCache();
    if (!indexPageIsValid && !skipGuard && !cachedUserInfo.current) push(urlWithQuery);
  }, [indexPageIsValid, skipGuard, push, params]);

  if (cachedUserInfo.current) {
    return true;
  }
  return indexPageIsValid;
};

export const useConfirmUnload = (skip = false) => {
  const { errorCode } = useErrorContext();

  useEffect(() => {
    if (!skip && !errorCode) {
      const handleBeforeUnload = (e: any) => {
        e.preventDefault();
        const currentURL = window.location.href;
        const keywordsRegex = /connect-bank-account|kyc|connect-debit-card/;
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
    } else {
      window.onbeforeunload = null;
    }
  }, [errorCode, skip]);
};

export const useConfirmIsOAuthRedirect = () => {
  const [isPlaidOAuthRedirect, setIsPlaidOAuthRedirect] = useState(false);
  useEffect(() => {
    setIsPlaidOAuthRedirect(window.location.href.includes("oauth_state_id="));
  }, []);
  return isPlaidOAuthRedirect;
};
