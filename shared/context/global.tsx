"use-client";

import { Auth, ConfirmationResult } from "firebase/auth";
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getUserSession } from "@/utils/utils";
import { Analytics, getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { RecaptchaVerifier, getAuth } from "firebase/auth";
import { firebaseConfig } from "../config";
import { UserSession } from "../http/types";

export interface IGlobalContext {
  analytics: Analytics | null;
  auth: Auth | null;
  recaptchaVerifier: RecaptchaVerifier | null;
  userSession: UserSession | null;
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

let computedUserSession: IGlobalContext["userSession"] = null;
export const getComputedUserSession = () => computedUserSession;

const globalContext = createContext<IGlobalContext>(null as any);

export const GlobalProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const [analytics, setAnalytics] = useState<IGlobalContext["analytics"]>(null);
  const [userSession, setUserSession] = useState<IGlobalContext["userSession"]>(null);
  const [auth, setAuth] = useState<IGlobalContext["auth"]>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<IGlobalContext["recaptchaVerifier"]>(null);

  const resetAuth = useCallback(() => {
    const _analytics = getAnalytics(app);
    const _auth = getAuth(app);
    const _recaptchaVerifier = new RecaptchaVerifier(_auth, "recaptcha-container", {});

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

  useEffect(() => {
    const getAndSetUserSession = async () => {
      const newUserSession = await getUserSession();
      computedUserSession = newUserSession;
      setUserSession(newUserSession);
    };

    getAndSetUserSession().catch(() => {});
  }, []);

  const [confirmationResult, setConfirmationResult] = useState<null | ConfirmationResult>(null);

  return (
    <globalContext.Provider
      value={{
        analytics,
        auth,
        recaptchaVerifier,
        confirmationResult,
        userSession,
        setConfirmationResult,
        resetAuth,
      }}
    >
      {children}
    </globalContext.Provider>
  );
};

export const useGlobal = () => useContext(globalContext);
