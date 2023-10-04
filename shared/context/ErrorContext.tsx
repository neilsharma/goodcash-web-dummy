"use-client";

import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

export interface IErrorContext {
  errorCode: string | undefined;
  setErrorCode: Dispatch<SetStateAction<string | undefined>>;
}
const errorContext = createContext<IErrorContext>(null as any);

export const ErrorProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const [errorCode, setErrorCode] = useState<string | undefined>("");
  return (
    <errorContext.Provider
      value={{
        errorCode,
        setErrorCode,
      }}
    >
      {children}
    </errorContext.Provider>
  );
};

export const useErrorContext = () => useContext(errorContext);
