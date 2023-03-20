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
  signPierLoanAgreement,
} from "@/shared/http/services/user";

export default function OneLastStep() {
  useConfirmUnload();
  const { push } = useRouter();
  const {
    pierOnboardingStatus,
    setPierOnboardingStatus,
    pierApplicationId,
    pierLoanAgreementId,
    setPierLoanAgreementId,
    pierLoanAgreementDocumentUrl,
    setPierLoanAgreementDocumentUrl,
    setPierFacilityId,
  } = useOnboarding();

  const createLoanAgreement = useCallback(async () => {
    let onboardingStatus = pierOnboardingStatus;
    let loanAgreementId = pierLoanAgreementId;

    if (onboardingStatus === "APPLICATION_APPROVED" || loanAgreementId === null) {
      const { id } = await createPierLoanAgreement(pierApplicationId!);
      setPierLoanAgreementId((loanAgreementId = id));
      setPierOnboardingStatus((onboardingStatus = "LOAN_AGREEMENT_CREATED"));
    }

    if (onboardingStatus === "LOAN_AGREEMENT_CREATED") {
      const { documentUrl } = await signPierLoanAgreement(loanAgreementId);
      setPierLoanAgreementDocumentUrl(documentUrl);
      setPierOnboardingStatus((onboardingStatus = "LOAN_AGREEMENT_SIGNED"));
    }
  }, [
    pierOnboardingStatus,
    setPierOnboardingStatus,
    pierLoanAgreementId,
    setPierLoanAgreementId,
    pierApplicationId,
    setPierLoanAgreementDocumentUrl,
  ]);

  const documentSigned = useMemo(
    () => pierOnboardingStatus === "LOAN_AGREEMENT_SIGNED" && !!pierLoanAgreementDocumentUrl,
    [pierOnboardingStatus, pierLoanAgreementDocumentUrl]
  );

  const [isLoading, setIsLoading] = useState(false);
  const completePierOnboarding = useCallback(async () => {
    setIsLoading(true);
    try {
      if (pierOnboardingStatus === "FACILITY_CREATED") return push("/onboarding/how-did-you-hear");
      if (!documentSigned) return;

      const { id } = await createPierFacility(pierLoanAgreementId!);
      setPierFacilityId(id);
      setPierOnboardingStatus("FACILITY_CREATED");
      push("/onboarding/how-did-you-hear");
    } catch (error) {
      setIsLoading(false);
    }
  }, [
    setIsLoading,
    documentSigned,
    pierOnboardingStatus,
    setPierFacilityId,
    pierLoanAgreementId,
    setPierOnboardingStatus,
    push,
  ]);

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
        className="my-12"
        disabled={!documentSigned}
        onClick={completePierOnboarding}
        isLoading={isLoading}
      >
        Agree to terms and conditions
      </Button>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
