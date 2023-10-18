"use client";

import Button from "@/components/Button";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { useCallback, useEffect } from "react";
import { useGetTrackPage } from "@/shared/hooks/useTrackPage";
import { useWebAppErrorContext } from "@/app/context/webAppError";
import WebAppLayout from "@/components/WebAppLayout";
import { useErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/navigation";
import { webAppRoutes } from "../shared/constants";

export default function ErrorPage() {
  const { errorCode, errorData } = useWebAppErrorContext();
  const { resetBoundary } = useErrorBoundary();
  const { replace } = useRouter();
  const trackPage = useGetTrackPage();
  useEffect(
    () =>
      errorData.screenEventTitle && trackPage(errorData.screenEventTitle, errorCode || undefined),
    [trackPage, errorData?.screenEventTitle, errorCode]
  );

  const tryAgain = useCallback(() => {
    replace(webAppRoutes.LOGIN);
    resetBoundary();
  }, [replace, resetBoundary]);

  return (
    <WebAppLayout>
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
        {errorData.secondaryButtonText && errorData.secondaryButtonFunction ? (
          <a href={errorData.secondaryButtonFunction()} className="w-full">
            <Button variant="text">{errorData.secondaryButtonText}</Button>
          </a>
        ) : null}
      </div>

      {errorCode ? <p className="opacity-30 ">ERROR: {errorCode}</p> : null}
    </WebAppLayout>
  );
}
