import Button from "@/components/Button";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useGetTrackPage } from "../../shared/hooks/useTrackPage";
import { useErrorContext } from "../../shared/context/error";

export default function OnboardingSomethingWrongPage() {
  const { setErrorCode, errorCode, errorData } = useErrorContext();

  useConfirmUnload(errorData.skipConfirmUnload);

  const trackPage = useGetTrackPage();
  useEffect(
    () => trackPage(errorData.screenEventTitle, errorCode || undefined),
    [trackPage, errorData.screenEventTitle, errorCode]
  );

  const { back } = useRouter();
  const tryAgain = useCallback(() => {
    setErrorCode(null);
    (errorData.tryAgainCallFunction || back)();
  }, [setErrorCode, back, errorData.tryAgainCallFunction]);

  return (
    <OnboardingLayout>
      <Title>{errorData.title}</Title>
      <SubTitle className="my-4">{errorData.subTitle1}</SubTitle>
      <SubTitle className="my-4">{errorData.subTittle2}</SubTitle>

      <div className="flex gap-4 my-12">
        {errorData.tryAgainEnabled ? (
          <Button onClick={tryAgain}>{errorData.tryAgainText}</Button>
        ) : null}
        {errorData.contactSupportEnabled ? (
          <a href="mailto:support@goodcash.com" className="w-full">
            <Button variant="text">Contact support</Button>
          </a>
        ) : null}
      </div>

      {errorCode ? <p className="opacity-30 ">ERROR: {errorCode}</p> : null}
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
