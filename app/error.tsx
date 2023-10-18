"use client";

import Button from "@/components/Button";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { useCallback, useEffect, useMemo } from "react";
import { useGetTrackPage } from "@/shared/hooks/useTrackPage";

import {
  ErrorData,
  defaultErrorData,
  errorCodesToErrorPayloadMap,
  extractApiErrorCode,
} from "@/shared/error";

interface ErrorPageProps {
  error?: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const trackPage = useGetTrackPage();

  const errorCode = useMemo(() => extractApiErrorCode(error), [error]);
  const errorData = useMemo<ErrorData>(
    () => ({
      ...defaultErrorData,
      ...(errorCode
        ? (errorCodesToErrorPayloadMap as Record<string, Partial<ErrorData>>)[errorCode] || {}
        : {}),
    }),
    [errorCode]
  );

  useEffect(
    () =>
      errorData.screenEventTitle && trackPage(errorData.screenEventTitle, errorCode || undefined),
    [trackPage, errorData?.screenEventTitle, errorCode]
  );

  const tryAgain = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <>
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
    </>
  );
}
