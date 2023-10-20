"use client";

import { Dispatch, FC, ReactNode, createContext, useContext, useState } from "react";
import ErrorPage from "./error";

export interface IErrorContext {
  error: unknown | null;
  setError: Dispatch<unknown | null>;
}

const errorContext = createContext<IErrorContext>(null as any);

export const ErrorProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const [error, setError] = useState<IErrorContext["error"]>(null);

  return (
    <errorContext.Provider
      value={{
        error,
        setError,
      }}
    >
      {error ? <ErrorPage error={error as Error} reset={() => setError(null)} /> : children}
    </errorContext.Provider>
  );
};

export const useErrorContext = () => useContext(errorContext);
