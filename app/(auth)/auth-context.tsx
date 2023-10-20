"use client";

import {
  Dispatch,
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Auth, ConfirmationResult, RecaptchaVerifier, getAuth } from "firebase/auth";
import { app } from "@/shared/context/global";

export interface IAuthContext {
  phone: string;
  setPhone: Dispatch<string>;
  confirmationResult: ConfirmationResult | null;
  setConfirmationResult: Dispatch<ConfirmationResult | null>;
  auth: Auth | null;
  recaptchaVerifier: RecaptchaVerifier | null;
  resetAuth: () => readonly [Auth, RecaptchaVerifier];
}

const authContext = createContext<IAuthContext>(null as any);

export const AuthProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const [phone, setPhone] = useState("");

  const [auth, setAuth] = useState<Auth | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  const [confirmationResult, setConfirmationResult] =
    useState<IAuthContext["confirmationResult"]>(null);

  const resetAuth = useCallback(() => {
    const _auth = getAuth(app);
    const _recaptchaVerifier = new RecaptchaVerifier(_auth, "recaptcha-container", {});

    setAuth(_auth);
    setRecaptchaVerifier(_recaptchaVerifier);
    return [_auth, _recaptchaVerifier] as const;
  }, []);

  useEffect(() => {
    resetAuth();
  }, [resetAuth]);

  return (
    <authContext.Provider
      value={{
        phone,
        setPhone,
        confirmationResult,
        setConfirmationResult,
        auth,
        recaptchaVerifier,
        resetAuth,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
