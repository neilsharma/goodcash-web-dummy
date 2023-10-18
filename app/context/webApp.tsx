"use client";

import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

export interface IWebAppContext {
  phone: string;
  setPhone: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
}

const webAppContext = createContext<IWebAppContext>(null as any);

export const WebAppProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  return (
    <webAppContext.Provider
      value={{
        phone,
        setPhone,
        email,
        setEmail,
      }}
    >
      {children}
    </webAppContext.Provider>
  );
};

export const useWebAppContext = () => useContext(webAppContext);
