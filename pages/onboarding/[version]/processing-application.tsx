import { useCallback, useEffect } from "react";
import { useOnboarding } from "@/shared/context/onboarding";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import { UserHttpService } from "@/shared/http/services/user";
import { UnderwritingHttpService } from "@/shared/http/services/underwriting";
import { isLocalhost } from "@/shared/config";
import { BankAccountVerificationErrCodes, extractApiErrorCode } from "@/shared/error";
import { ELocalStorageKeys, EScreenEventTitle } from "../../../utils/types";
import useTrackPage from "../../../shared/hooks/useTrackPage";
import { LoanAgreementsHttpService } from "@/shared/http/services/loanAgreements";
import { ELoanAgreementStatus } from "@/shared/http/types";
import { EStepStatus } from "../../../shared/types";
import ProgressLoader from "../../../components/ProgressLoader";
import { useErrorContext } from "../../../shared/context/error";
import { OnboardingErrorDefs } from "../../../shared/constants";
import pagesRouterHttpClient from "@/shared/http/clients/pages-router";

const { longPollAssetStatus, patchUserOnboarding } = new UserHttpService(pagesRouterHttpClient);
const { failUnderwriting, underwrite } = new UnderwritingHttpService(pagesRouterHttpClient);
const { approveApplication, longPollLongAgreementStatus, createLoanApplication } =
  new LoanAgreementsHttpService(pagesRouterHttpClient);

export default function ProcessingApplication() {
  useConfirmUnload();

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

            return setErrorCode(BankAccountVerificationErrCodes.NOT_ENOUGH_MONEY);
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
    } catch (error) {
      onboardingStepHandler(EStepStatus.FAILED);
      setErrorCode(extractApiErrorCode(error));
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
  ]);

  useTrackPage(EScreenEventTitle.PROCESSING_APPLICATION);

  useEffect(() => {
    processApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ProgressLoader type="PROCESSING_APPLICATION" />;
}

export const getServerSideProps = redirectIfServerSideRendered;
