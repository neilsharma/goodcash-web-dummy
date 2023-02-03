"use-client";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useOnboarding } from "../onboarding/context";

export const useIndexPageComplected = () => {
  const { indexPageIsValid } = useOnboarding();
  const { replace } = useRouter();

  useEffect(() => {
    if (!indexPageIsValid) replace("/onboarding");
  }, [indexPageIsValid, replace]);

  return indexPageIsValid;
};

export const canUseDOM = () =>
  !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  );

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
