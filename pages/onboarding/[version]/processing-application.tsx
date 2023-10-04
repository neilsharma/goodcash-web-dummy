import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { useOnboarding } from "@/shared/context/onboarding";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import { longPollAssetStatus, patchUserOnboarding } from "@/shared/http/services/user";
import { failUnderwriting, underwrite } from "@/shared/http/services/underwriting";
import { isLocalhost } from "@/shared/config";
import { parseApiError } from "@/shared/error";
import { ELocalStorageKeys, EScreenEventTitle } from "../../../utils/types";
import useTrackPage from "../../../shared/hooks/useTrackPage";
import {
  approveApplication,
  longPollLongAgreementStatus,
  createLoanApplication,
} from "@/shared/http/services/loanAgreements";
import { ELoanAgreementStatus } from "@/shared/http/types";
import { EStepStatus } from "../../../shared/types";
import ProgressLoader from "../../../components/ProgressLoader";
import { useErrorContext } from "../../../shared/context/ErrorContext";
import { OnboardingErrorDefs } from "../../../shared/constants";

export default function ProcessingApplication() {
  useConfirmUnload();

  const { push } = useRouter();
  const { setErrorCode } = useErrorContext();
  const {
    setIsUserBlocked,
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    setOnboardingStep,
    setPlaid,
    onboardingStepHandler,
    version,
  } = useOnboarding();

  const processApplication = useCallback(async () => {
    try {
      if (!onboardingOperationsMap.loanApplicationCreated) {
        await createLoanApplication();
        const status = await longPollLongAgreementStatus([
          ELoanAgreementStatus.CREATED,
          ELoanAgreementStatus.CREATION_FAILED,
        ]);

        if (status === ELoanAgreementStatus.CREATED) {
          setOnboardingOperationsMap((p) => ({ ...p, loanApplicationCreated: true }));
          patchUserOnboarding({
            onboardingOperationsMap: { loanApplicationCreated: true },
          });
        } else if (status === ELoanAgreementStatus.CREATION_FAILED) {
          setErrorCode(OnboardingErrorDefs.LOAN_AGREEMENT_CREATION_FAILED);
          throw new Error("Loan Application Creation Failed");
        }
      }

      if (!isLocalhost && !onboardingOperationsMap.underwritingSucceeded) {
        const assetStatus = await longPollAssetStatus();

        if (assetStatus === "DENIED") {
          await failUnderwriting();
          return setIsUserBlocked(true);
        }

        const { status } = await underwrite().catch(() => ({ status: "DENIED" }));

        switch (status) {
          case "APPROVED":
            setOnboardingOperationsMap((p) => ({ ...p, underwritingSucceeded: true }));
            patchUserOnboarding({
              onboardingOperationsMap: { underwritingSucceeded: true },
            });
            break;
          case "DENIED":
            setOnboardingOperationsMap((p) => ({
              ...p,
              loanApplicationCreated: false,
              loanApplicationApproved: false,
              bankAccountCreated: false,
            }));
            patchUserOnboarding({
              onboardingStep: version == 1 ? "FUNDING_CARD_LINKING" : "BANK_ACCOUNT_LINKING",
              onboardingOperationsMap: {
                loanApplicationCreated: false,
                loanApplicationApproved: false,
                bankAccountCreated: false,
              },
            });
            setPlaid(null);
            setOnboardingStep(version == 1 ? "FUNDING_CARD_LINKING" : "BANK_ACCOUNT_LINKING");

            localStorage.removeItem(ELocalStorageKeys.LINK_TOKEN);

            return push(`/onboarding/${version}/not-enough-money`);
        }
      }

      if (!onboardingOperationsMap.loanApplicationApproved) {
        await approveApplication();

        setOnboardingOperationsMap((p) => ({ ...p, loanApplicationApproved: true }));
        patchUserOnboarding({
          onboardingStep: "LOAN_APPLICATION_SUBMISSION",
          onboardingOperationsMap: { loanApplicationApproved: true },
        });
      }

      setOnboardingStep("LOAN_APPLICATION_SUBMISSION");
      onboardingStepHandler(EStepStatus.COMPLETED);
    } catch (error: any) {
      const errorObject = parseApiError(error);
      setErrorCode(errorObject?.errorCode ?? "");
      if (errorObject?.errorCode === "UNDERWRITING0002") return setIsUserBlocked(true);

      onboardingStepHandler(EStepStatus.FAILED);
    }
  }, [
    onboardingOperationsMap.loanApplicationCreated,
    onboardingOperationsMap.underwritingSucceeded,
    onboardingOperationsMap.loanApplicationApproved,
    setOnboardingStep,
    onboardingStepHandler,
    setOnboardingOperationsMap,
    setErrorCode,
    setIsUserBlocked,
    version,
    setPlaid,
    push,
  ]);

  useTrackPage(EScreenEventTitle.PROCESSING_APPLICATION);

  useEffect(() => {
    processApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ProgressLoader type="PROCESSING_APPLICATION" />;
}

export const getServerSideProps = redirectIfServerSideRendered;
