"use client";
import { ErrorBoundary } from "react-error-boundary";
import VerifyPage from "./page";
import ErrorPage from "../error";
import { useWebAppErrorContext } from "../context/webAppError";

export default function VerifyLayout() {
  const { setErrorCode } = useWebAppErrorContext();
  return (
    <ErrorBoundary
      fallback={<ErrorPage />}
      onReset={() => {
        setErrorCode(null);
      }}
    >
      <VerifyPage />
    </ErrorBoundary>
  );
}
