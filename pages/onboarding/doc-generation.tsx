import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import LoadingPDFIndicator from "@/components/LoadingPDFIndicator";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { useOnboarding } from "@/shared/context/onboarding";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import { patchUserOnboarding } from "@/shared/http/services/user";
import { onboardingStepToPageMap, privacyPolicyUrl, termsOfServiceUrl } from "@/shared/constants";
import { EScreenEventTitle } from "../../utils/types";
import useTrackPage from "../../shared/hooks/useTrackPage";
import {
  longPollLongAgreementStatus,
  completeLoanAgreement,
  createLoanAgreement,
  getLoanAgreementUrl,
} from "@/shared/http/services/loanAgreements";
import { ELoanAgreementStatus } from "@/shared/http/types";
import PDFViewer from "../../components/PdfViewer";

export default function OneLastStep() {
  useConfirmUnload();

  const { push } = useRouter();
  const {
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    setOnboardingStep,
    loanAgreementDocumentUrl,
    setLoanAgreementDocumentUrl,
    redirectToGenericErrorPage,
  } = useOnboarding();

  const createLoanAgreementHandler = useCallback(async () => {
    try {
      if (!onboardingOperationsMap.loanAgreementCreated) {
        await createLoanAgreement();
        const status = await longPollLongAgreementStatus([
          ELoanAgreementStatus.SIGNED,
          ELoanAgreementStatus.SIGN_FAILED,
        ]);

        if (status === ELoanAgreementStatus.SIGNED) {
          setOnboardingOperationsMap((p) => ({ ...p, loanAgreementCreated: true }));
          patchUserOnboarding({
            onboardingOperationsMap: { loanAgreementCreated: true },
          });

          setLoanAgreementDocumentUrl(await getLoanAgreementUrl());
        } else if (status === ELoanAgreementStatus.SIGN_FAILED) {
          throw new Error("Loan Agreement Creation Failed");
        }
      }
    } catch (e) {
      redirectToGenericErrorPage();
    }
  }, [
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    setLoanAgreementDocumentUrl,
    redirectToGenericErrorPage,
  ]);

  const documentSigned = useMemo(
    () => onboardingOperationsMap.loanAgreementCreated && !!loanAgreementDocumentUrl,
    [onboardingOperationsMap, loanAgreementDocumentUrl]
  );

  const [isLoading, setIsLoading] = useState(false);
  const completeLoanAgreementHandler = useCallback(async () => {
    setIsLoading(true);
    try {
      if (onboardingOperationsMap.loanAgreementCompleted)
        return push(onboardingStepToPageMap.REFERRAL_SOURCE);
      if (!documentSigned) return;

      await completeLoanAgreement();
      const status = await longPollLongAgreementStatus([
        ELoanAgreementStatus.COMPLETED,
        ELoanAgreementStatus.COMPLETION_FAILED,
      ]);

      if (status === ELoanAgreementStatus.COMPLETED) {
        setOnboardingOperationsMap((p) => ({ ...p, loanAgreementCompleted: true }));
        setOnboardingStep("REFERRAL_SOURCE");
        patchUserOnboarding({
          onboardingStep: "REFERRAL_SOURCE",
          onboardingOperationsMap: { loanAgreementCompleted: true },
        });
        push(onboardingStepToPageMap.REFERRAL_SOURCE);
      } else if (status === ELoanAgreementStatus.COMPLETION_FAILED) {
        throw new Error("Loan Agreement Completion Failed");
      }
    } catch (error) {
      redirectToGenericErrorPage();
    }
  }, [
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    setIsLoading,
    documentSigned,
    setOnboardingStep,
    push,
    redirectToGenericErrorPage,
  ]);

  useTrackPage(EScreenEventTitle.DOC_GENERATION);

  useEffect(() => {
    createLoanAgreementHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        disabled={!documentSigned}
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
