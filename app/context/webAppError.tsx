"use client";

import { Dispatch, FC, ReactNode, createContext, useContext, useState } from "react";
import ErrorPage from "../error";

export interface IErrorContext {
  error: unknown | null;
  setError: Dispatch<unknown | null>;
}

const webAppErrorContext = createContext<IErrorContext>(null as any);

export const WebAppErrorProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const [error, setError] = useState<IErrorContext["error"]>(null);

  return (
    <webAppErrorContext.Provider
      value={{
        error,
        setError,
      }}
    >
      {error ? <ErrorPage error={error as Error} reset={() => setError(null)} /> : children}
    </webAppErrorContext.Provider>
  );
};

export const useWebAppErrorContext = () => useContext(webAppErrorContext);
