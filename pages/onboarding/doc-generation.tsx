import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import LoadingPDFIndicator from "@/components/LoadingPDFIndicator";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { useOnboarding } from "@/shared/context/onboarding";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import {
  createPierFacility,
  createPierLoanAgreement,
  patchUserOnboarding,
  signPierLoanAgreement,
} from "@/shared/http/services/user";
import { onboardingStepToPageMap } from "@/shared/constants";
import { trackPage } from "../../utils/analytics/analytics";
import { EScreenEventTitle } from "../../utils/types";
import useTrackPage from "../../shared/hooks/useTrackPage";

export default function OneLastStep() {
  useConfirmUnload();

  const { push } = useRouter();
  const {
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    setOnboardingStep,
    pierApplicationId,
    pierLoanAgreementId,
    setPierLoanAgreementId,
    pierLoanAgreementDocumentUrl,
    setPierLoanAgreementDocumentUrl,
    setPierFacilityId,
    redirectToGenericErrorPage,
  } = useOnboarding();

  const createLoanAgreement = useCallback(async () => {
    try {
      let loanAgreementId = pierLoanAgreementId;

      if (!onboardingOperationsMap.pierLoanAgreementCreated || loanAgreementId === null) {
        const { id } = await createPierLoanAgreement(pierApplicationId!);
        setPierLoanAgreementId((loanAgreementId = id));
        setOnboardingOperationsMap((p) => ({ ...p, pierLoanAgreementCreated: true }));
        patchUserOnboarding({
          pierLoanAgreementId: id,
          onboardingOperationsMap: { pierLoanAgreementCreated: true },
        });
      }

      if (!onboardingOperationsMap.pierLoanAgreementSigned) {
        const { documentUrl } = await signPierLoanAgreement(loanAgreementId);
        setPierLoanAgreementDocumentUrl(documentUrl);
        setOnboardingOperationsMap((p) => ({ ...p, pierLoanAgreementSigned: true }));
        patchUserOnboarding({
          pierLoanAgreementDocumentUrl: documentUrl,
          onboardingOperationsMap: { pierLoanAgreementSigned: true },
        });
      }
    } catch (e) {
      redirectToGenericErrorPage();
    }
  }, [
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    pierLoanAgreementId,
    setPierLoanAgreementId,
    pierApplicationId,
    setPierLoanAgreementDocumentUrl,
    redirectToGenericErrorPage,
  ]);

  const documentSigned = useMemo(
    () => onboardingOperationsMap.pierLoanAgreementSigned && !!pierLoanAgreementDocumentUrl,
    [onboardingOperationsMap, pierLoanAgreementDocumentUrl]
  );

  const [isLoading, setIsLoading] = useState(false);
  const completePierOnboarding = useCallback(async () => {
    setIsLoading(true);
    try {
      if (onboardingOperationsMap.pierFacilityCreated)
        return push(onboardingStepToPageMap.REFERRAL_SOURCE);
      if (!documentSigned) return;

      const { id } = await createPierFacility(pierLoanAgreementId!);
      setPierFacilityId(id);
      setOnboardingOperationsMap((p) => ({ ...p, pierFacilityCreated: true }));
      setOnboardingStep("REFERRAL_SOURCE");
      patchUserOnboarding({
        pierFacilityId: id,
        onboardingStep: "REFERRAL_SOURCE",
        onboardingOperationsMap: { pierFacilityCreated: true },
      });
      push(onboardingStepToPageMap.REFERRAL_SOURCE);
    } catch (error) {
      redirectToGenericErrorPage();
    }
  }, [
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    setIsLoading,
    documentSigned,
    setPierFacilityId,
    pierLoanAgreementId,
    setOnboardingStep,
    push,
    redirectToGenericErrorPage,
  ]);

  useTrackPage(EScreenEventTitle.DOC_GENERATION);

  useEffect(() => {
    createLoanAgreement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OnboardingLayout>
      <Title>One last step</Title>
      <SubTitle>
        Below is your custom line of credit agreement based on your bank history. Accepting will not
        impact your credit score or require a credit check.
      </SubTitle>

      {pierLoanAgreementDocumentUrl ? (
        <iframe src={pierLoanAgreementDocumentUrl} className="w-full h-96 my-10" allowFullScreen />
      ) : (
        <LoadingPDFIndicator />
      )}

      <Button
        className="mt-12"
        disabled={!documentSigned}
        onClick={completePierOnboarding}
        isLoading={isLoading}
      >
        Agree to terms and conditions
      </Button>

      <p className="font-sharpGroteskBook text-thinText text-sm my-6">
        By clicking “Agree to terms and conditions”, you agree to our partner Pier’s{" "}
        <a href="#">Privacy Policy</a>, <a href="#">Terms of Service</a> and{" "}
        <a href="#">Line of Credit Agreement</a>.
      </p>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
