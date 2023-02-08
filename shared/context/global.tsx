"use-client";

import { Auth, ConfirmationResult } from "firebase/auth";
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { Analytics, getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "../config";

export interface IGlobalContext {
  analytics: Analytics | null;
  auth: Auth | null;
  recaptchaVerifier: RecaptchaVerifier | null;
  confirmationResult: ConfirmationResult | null;
  setConfirmationResult: Dispatch<SetStateAction<ConfirmationResult | null>>;
  resetAuth: () => readonly [Auth, RecaptchaVerifier, Analytics];
}

export const app = initializeApp(firebaseConfig);

let computedAuth: IGlobalContext["auth"] = null;
export const getComputedAuth = () => computedAuth;

let computedAnalytics: IGlobalContext["analytics"] = null;
export const getComputedAnalytics = () => computedAnalytics;

let computedRecaptchaVerifier: IGlobalContext["recaptchaVerifier"] = null;
export const getComputedRecaptchaVerifier = () => computedRecaptchaVerifier;

const globalContext = createContext<IGlobalContext>(null as any);

export const GlobalProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const [analytics, setAnalytics] = useState<IGlobalContext["analytics"]>(null);
  const [auth, setAuth] = useState<IGlobalContext["auth"]>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<IGlobalContext["recaptchaVerifier"]>(null);

  const resetAuth = useCallback(() => {
    const _analytics = getAnalytics(app);
    const _auth = getAuth(app);
    const _recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {}, _auth);

    computedAuth = _auth;
    computedAnalytics = _analytics;

    setAnalytics(_analytics);
    setAuth(_auth);
    setRecaptchaVerifier(_recaptchaVerifier);

    return [_auth, _recaptchaVerifier, _analytics] as const;
  }, []);

  useEffect(() => {
    resetAuth();
  }, [resetAuth]);

  const [confirmationResult, setConfirmationResult] = useState<null | ConfirmationResult>(null);

  return (
    <globalContext.Provider
      value={{
        analytics,
        auth,
        recaptchaVerifier,
        confirmationResult,
        setConfirmationResult,
        resetAuth,
      }}
    >
      {children}
    </globalContext.Provider>
  );
};

export const useGlobal = () => useContext(globalContext);
