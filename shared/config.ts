import type { FirebaseOptions } from "firebase/app";

export type GoodcashEnvironment = "local" | "sandbox" | "production";

export const goodcashEnvironment: GoodcashEnvironment =
  (process.env["GOODCASH_ENVIRONMENT"] as GoodcashEnvironment) ?? "local";

const domains: Record<GoodcashEnvironment, string> = {
  local: "http://localhost:3000",
  sandbox: "https://goodcash-sandbox.goodcashapis.com",
  production: "https://goodcash-production.goodcashapis.com",
};

export const domain = domains[goodcashEnvironment] ?? domains.local;

const productionFirebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyC9Ic8CPNxYF7nFwy1FODVn7Ru-6YfVIJw",
  authDomain: "goodcash-production.firebaseapp.com",
  projectId: "goodcash-production",
  storageBucket: "goodcash-production.appspot.com",
  messagingSenderId: "867219604672",
  appId: "1:867219604672:web:da3057e1f413cb51481925",
  measurementId: "G-NK87LZ4D7D",
};

const sandboxFirebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyD7XdUh3HLCCIYXxJFb2cZqtrg1aFX7gK4",
  authDomain: "goodcash-sandbox.firebaseapp.com",
  projectId: "goodcash-sandbox",
  storageBucket: "goodcash-sandbox.appspot.com",
  messagingSenderId: "82857152247",
  appId: "1:82857152247:web:49d403225b397730094df2",
  measurementId: "G-EZYR3524JP",
};

const firebaseConfigs: Record<GoodcashEnvironment, FirebaseOptions> = {
  production: productionFirebaseConfig,
  sandbox: sandboxFirebaseConfig,
  local: sandboxFirebaseConfig,
};

export const firebaseConfig = firebaseConfigs[goodcashEnvironment] ?? firebaseConfigs.local;

export const appStoreId = "";
export const googlePlayId = "";
