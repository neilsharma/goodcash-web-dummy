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
} from "../error";

export interface IErrorContext {
  errorCode: SupportedErrorCodes | undefined | null;
  setErrorCode: Dispatch<SetStateAction<SupportedErrorCodes | undefined | null>>;
  errorData: ErrorData;
}

const errorContext = createContext<IErrorContext>(null as any);

export const ErrorProvider: FC<{ children?: ReactNode }> = ({ children }) => {
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
    <errorContext.Provider
      value={{
        errorCode,
        setErrorCode,
        errorData,
      }}
    >
      {children}
    </errorContext.Provider>
  );
};

export const useErrorContext = () => useContext(errorContext);
