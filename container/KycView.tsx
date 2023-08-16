import { useRef, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useRouter } from "next/router";
import OnboardingLayout from "@/components/OnboardingLayout";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import { useOnboarding } from "@/shared/context/onboarding";
import { getKycPlaidToken } from "@/shared/http/services/plaid";
import {
  fillKYCIdentity,
  longPollKycSubmissionStatus,
  patchUserOnboarding,
  submitKyc,
} from "@/shared/http/services/user";
import { onboardingStepToPageMap } from "@/shared/constants";
import { goodcashEnvironment } from "@/shared/config";
import useTrackPage from "@/shared/hooks/useTrackPage";
import { EScreenEventTitle, ESentryEvents } from "@/utils/types";
import Loader from "@/components/Loader";
import { EStepStatus } from "../shared/types";

export default function OnboardingPlaidKycView() {
  useConfirmUnload();
  const { push } = useRouter();
  const {
    phone,
    email,
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    setOnboardingStep,
    onboardingStepHandler,
  } = useOnboarding();

  useTrackPage(EScreenEventTitle.KYC);

  const [plaidLinkToken, setPlaidLinkToken] = useState("");
  const [shouldBeClosed, setShouldBeClosed] = useState(false);

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
            setOnboardingOperationsMap((p) => ({ ...p, userKycSubmitted: true }));
            patchUserOnboarding({
              onboardingOperationsMap: { userKycSubmitted: true },
            });
          } else if (status === "FAILED") {
            throw new Error(status);
          }
        }

        setOnboardingStep("BANK_ACCOUNT_LINKING");
        patchUserOnboarding({ onboardingStep: "BANK_ACCOUNT_LINKING" });
        onboardingStepHandler(EStepStatus.IN_PROGRESS);
      } catch (e) {
        setShouldBeClosed(true);
        onboardingStepHandler(EStepStatus.FAILED);
      }
    },
    onExit: () => {
      if (!isCompleted.current) shouldReopen.current = true;
    },
  });

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

  return (
    <OnboardingLayout>
      <Loader className="mt-24" />
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;