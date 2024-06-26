import { useCallback, useEffect, useState } from "react";
import Button from "@/components/Button";
import LoadingPDFIndicator from "@/components/LoadingPDFIndicator";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { useOnboarding } from "@/shared/context/onboarding";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import { privacyPolicyUrl, termsOfServiceUrl } from "@/shared/constants";
import { EScreenEventTitle } from "../../../utils/types";
import useTrackPage from "../../../shared/hooks/useTrackPage";
import PDFViewer from "../../../components/PdfViewer";
import { EStepStatus } from "../../../shared/types";
import ProgressLoader from "../../../components/ProgressLoader";
import { useErrorContext } from "../../../shared/context/error";
import { extractApiErrorCode } from "../../../shared/error";

// const { longPollOnboardingCompletionStatus, patchUserOnboarding } = new UserHttpService(
//   pagesRouterHttpClient
// );
// const {
// longPollLongAgreementStatus,
// completeLoanAgreement,
// createLoanAgreement,
// getLoanAgreementUrl,
// } = new LoanAgreementsHttpService(pagesRouterHttpClient);

export default function OneLastStep() {
  useConfirmUnload();

  const {
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    setOnboardingStep,
    loanAgreementDocumentUrl,
    // setLoanAgreementDocumentUrl,
    onboardingStepHandler,
  } = useOnboarding();
  const { setErrorCode } = useErrorContext();

  const finish = useCallback(
    async (status: "COMPLETED" | "FAILED") => {
      try {
        if (status === "COMPLETED") {
          // trackGTagConversion(ConversionEvent.OnboardingCompleted);

          setOnboardingStep("LOAN_AGREEMENT_CREATION");
          setOnboardingOperationsMap((p) => ({ ...p, onboardingCompleted: true }));
          // patchUserOnboarding({
          //   onboardingStep: "LOAN_AGREEMENT_CREATION",
          //   onboardingOperationsMap: { onboardingCompleted: true },
          // });

          onboardingStepHandler(EStepStatus.COMPLETED);
        }
        if (status === "FAILED") {
          throw new Error("Onboarding completion failed");
        }
      } catch (error) {
        onboardingStepHandler(EStepStatus.FAILED);
      }
    },
    [setOnboardingStep, setOnboardingOperationsMap, onboardingStepHandler]
  );

  const createLoanAgreementHandler = useCallback(async () => {
    try {
      if (!onboardingOperationsMap.loanAgreementCreated) {
        // await createLoanAgreement();
        // const status = await longPollLongAgreementStatus([
        //   ELoanAgreementStatus.SIGNED,
        //   ELoanAgreementStatus.SIGN_FAILED,
        // ]);

        // if (status === ELoanAgreementStatus.SIGNED) {
        setOnboardingOperationsMap((p) => ({ ...p, loanAgreementCreated: true }));
        // patchUserOnboarding({
        //   onboardingOperationsMap: { loanAgreementCreated: true },
        // });

        // setLoanAgreementDocumentUrl(await getLoanAgreementUrl());
        // } else if (status === ELoanAgreementStatus.SIGN_FAILED) {
        // setErrorCode(OnboardingErrorDefs.LOAN_AGREEMENT_SIGN_FAILED);
        // throw new Error("Loan Agreement Creation Failed");
        // }
      }
    } catch (e) {
      onboardingStepHandler(EStepStatus.FAILED);
      setErrorCode(extractApiErrorCode(e));
    }
  }, [
    onboardingOperationsMap.loanAgreementCreated,
    setOnboardingOperationsMap,
    // setLoanAgreementDocumentUrl,
    setErrorCode,
    onboardingStepHandler,
  ]);

  // const documentSigned = useMemo(
  //   () => onboardingOperationsMap.loanAgreementCreated && !!loanAgreementDocumentUrl,
  //   [onboardingOperationsMap, loanAgreementDocumentUrl]
  // );

  const [isLoading, setIsLoading] = useState(false);
  const completeLoanAgreementHandler = useCallback(async () => {
    setIsLoading(true);
    try {
      // if (onboardingOperationsMap.loanAgreementCompleted)
      //   return onboardingStepHandler(EStepStatus.COMPLETED);
      // if (!documentSigned) return;

      // await completeLoanAgreement();
      // const status = await longPollLongAgreementStatus([
      //   ELoanAgreementStatus.COMPLETED,
      //   ELoanAgreementStatus.COMPLETION_FAILED,
      // ]);
      // if (status === ELoanAgreementStatus.COMPLETED) {
      setOnboardingOperationsMap((p) => ({ ...p, loanAgreementCompleted: true }));
      setOnboardingStep("APP_DOWNLOAD");
      // patchUserOnboarding({
      //   onboardingStep: "APP_DOWNLOAD",
      //   onboardingOperationsMap: { loanAgreementCompleted: true },
      // });

      // const onboardingStatus = await longPollOnboardingCompletionStatus();
      // await finish("onboardingStatus");
      await finish("COMPLETED");
      // } else if (status === ELoanAgreementStatus.COMPLETION_FAILED) {
      //   setErrorCode(OnboardingErrorDefs.LOAN_AGREEMENT_COMPLETION_FAILED);
      //   throw new Error("Loan Agreement Completion Failed");
      // }
    } catch (error) {
      onboardingStepHandler(EStepStatus.FAILED);
      setIsLoading(false);
      setErrorCode(extractApiErrorCode(error));
    }
  }, [
    // onboardingOperationsMap.loanAgreementCompleted,
    onboardingStepHandler,
    // documentSigned,
    setOnboardingOperationsMap,
    setOnboardingStep,
    finish,
    setErrorCode,
  ]);

  useTrackPage(EScreenEventTitle.DOC_GENERATION);

  useEffect(() => {
    createLoanAgreementHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <ProgressLoader type="FINALIZING" />;
  }

  return (
    <OnboardingLayout>
      <Title>One last step</Title>
      <SubTitle>
        Below is your custom line of credit agreement based on your bank history. Accepting will not
        impact your credit score or require a credit check.
      </SubTitle>

      {loanAgreementDocumentUrl ? (
        <PDFViewer url={loanAgreementDocumentUrl} />
      ) : (
        <LoadingPDFIndicator />
      )}

      <Button
        className="mt-12"
        // disabled={!documentSigned}
        disabled={false}
        onClick={completeLoanAgreementHandler}
        isLoading={isLoading}
      >
        Agree to terms and conditions
      </Button>

      <p className="font-sharpGroteskBook text-thinText text-sm my-6">
        By clicking “Agree to terms and conditions”, you agree to our partner Pier’s{" "}
        <a href={privacyPolicyUrl} target="blank">
          Privacy Policy
        </a>
        , <a href={termsOfServiceUrl}>Terms of Service</a> and{" "}
        <a href="#">Line of Credit Agreement</a>.
      </p>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
