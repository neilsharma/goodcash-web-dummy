"use client";

import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  ErrorData,
  SupportedErrorCodes,
  defaultErrorData,
  errorCodesToErrorPayloadMap,
} from "@/shared/error";

export interface IErrorContext {
  errorCode: SupportedErrorCodes | undefined | null;
  setErrorCode: Dispatch<SetStateAction<SupportedErrorCodes | undefined | null>>;
  errorData: ErrorData;
}

const webAppErrorContext = createContext<IErrorContext>(null as any);

export const WebAppErrorProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const [errorCode, setErrorCode] = useState<SupportedErrorCodes | undefined | null>(null);
  const errorData = useMemo<ErrorData>(
    () => ({
      ...defaultErrorData,
      ...(errorCode
        ? (errorCodesToErrorPayloadMap as Record<string, Partial<ErrorData>>)[errorCode] || {}
        : {}),
    }),
    [errorCode]
  );

  return (
    <webAppErrorContext.Provider
      value={{
        errorCode,
        setErrorCode,
        errorData,
      }}
    >
      {children}
    </webAppErrorContext.Provider>
  );
};

export const useWebAppErrorContext = () => useContext(webAppErrorContext);
