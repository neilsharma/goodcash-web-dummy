import { useRef, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useConfirmUnload } from "@/shared/hooks";
import { useOnboarding } from "@/shared/context/onboarding";
import { PlaidHttpService } from "@/shared/http/services/plaid";
import { UserHttpService } from "@/shared/http/services/user";
import { goodcashEnvironment } from "@/shared/config";
import useTrackPage from "@/shared/hooks/useTrackPage";
import { EScreenEventTitle } from "@/utils/types";
import { EStepStatus } from "../shared/types";
import { useErrorContext } from "../shared/context/error";
import { OnboardingErrorDefs } from "../shared/constants";
import ProgressLoader from "../components/ProgressLoader";
import pagesRouterHttpClient from "@/shared/http/clients/pages-router";

const { fillKYCIdentity, longPollKycSubmissionStatus, patchUserOnboarding, submitKyc } =
  new UserHttpService(pagesRouterHttpClient);
const { getKycPlaidToken } = new PlaidHttpService(pagesRouterHttpClient);

export default function OnboardingPlaidKycView() {
  useConfirmUnload();
  const { setErrorCode } = useErrorContext();
  const {
    phone,
    email,
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    setOnboardingStep,
    onboardingStepHandler,
    version,
  } = useOnboarding();

  useTrackPage(EScreenEventTitle.KYC);

  const [plaidLinkToken, setPlaidLinkToken] = useState("");
  const [shouldBeClosed, setShouldBeClosed] = useState(false);
  const [animateLoader, setAnimateLoader] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const shouldReopen = useRef(false);
  const isCompleted = useRef(false);

  useEffect(() => {
    if (phone && email) {
      getKycPlaidToken({ phone, email }).then(setPlaidLinkToken);
    }
  }, [phone, email, setPlaidLinkToken]);

  const { open, exit, ready } = usePlaidLink({
    token: plaidLinkToken,
    onSuccess: async (_publicToken, metadata) => {
      setShowLoader(true);
      try {
        isCompleted.current = true;
        shouldReopen.current = false;

        if (!onboardingOperationsMap.userKycFilled) {
          await fillKYCIdentity({ sessionId: metadata.link_session_id });

          if (goodcashEnvironment !== "production") setShouldBeClosed(true);

          setOnboardingOperationsMap((p) => ({ ...p, userKycFilled: true }));
          patchUserOnboarding({
            onboardingOperationsMap: { userKycFilled: true },
          });
        }

        if (!onboardingOperationsMap.userKycSubmitted) {
          await submitKyc();
          const status = await longPollKycSubmissionStatus();

          if (status === "COMPLETED") {
            patchUserOnboarding({
              onboardingOperationsMap: { userKycSubmitted: true },
            });
            setOnboardingOperationsMap((p) => ({ ...p, userKycSubmitted: true }));
          } else if (status === "FAILED") {
            setErrorCode(OnboardingErrorDefs.PLAID_IDV_FAILED);
            throw new Error(status);
          }
        }

        setOnboardingStep(version == 1 ? "FUNDING_CARD_LINKING" : "BANK_ACCOUNT_LINKING");
        patchUserOnboarding({
          onboardingStep: version == 1 ? "FUNDING_CARD_LINKING" : "BANK_ACCOUNT_LINKING",
        });
        setShouldBeClosed(true);
        showLoaderHandler();
      } catch (e: any) {
        setShouldBeClosed(true);
        onboardingStepHandler(EStepStatus.FAILED);
      }
    },
    onExit: () => {
      if (!isCompleted.current) shouldReopen.current = true;
    },
  });

  const showLoaderHandler = () => {
    setAnimateLoader(true);
    setTimeout(() => {
      onboardingStepHandler(EStepStatus.IN_PROGRESS);
    }, 5000);
  };

  useEffect(() => {
    if (shouldBeClosed) exit({ force: true });
  }, [shouldBeClosed, exit]);

  useEffect(() => {
    if (!ready || !plaidLinkToken) return;

    open();

    const interval = setInterval(() => {
      if (shouldReopen.current && !isCompleted.current) {
        shouldReopen.current = false;
        open();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [open, ready, plaidLinkToken]);
  if (showLoader) {
    return <ProgressLoader type="VERIFYING" animate={animateLoader} />;
  }
  return <ProgressLoader type="LOADING" initialValue={50} />;
}
