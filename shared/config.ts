import type { FirebaseOptions } from "firebase/app";

export type GoodcashEnvironment = "local" | "sandbox" | "production";

export const goodcashEnvironment: GoodcashEnvironment =
  (process.env["NEXT_PUBLIC_GOODCASH_ENVIRONMENT"] as GoodcashEnvironment) ?? "local";

export const domain = process.env["NEXT_PUBLIC_DOMAIN"] || "http://localhost:3000";
export const isLocalhost = domain.startsWith("http://localhost");

const defaultFirebaseConfig = JSON.stringify({
  apiKey: "AIzaSyD7XdUh3HLCCIYXxJFb2cZqtrg1aFX7gK4",
  authDomain: "goodcash-sandbox.firebaseapp.com",
  projectId: "goodcash-sandbox",
  storageBucket: "goodcash-sandbox.appspot.com",
  messagingSenderId: "82857152247",
  appId: "1:82857152247:web:49d403225b397730094df2",
  measurementId: "G-EZYR3524JP",
} as FirebaseOptions);

export const firebaseConfig = JSON.parse(
  process.env["NEXT_PUBLIC_FIREBASE_CONFIG"] || defaultFirebaseConfig
) as FirebaseOptions;

export const kardTermsVersion = process.env["NEXT_PUBLIC_KARD_TERMS_VERSION"] || "0.0.0";

export const appStoreId = "";
export const googlePlayId = "";
export const testFlightLink =
  process.env["NEXT_PUBLIC_TEST_FLIGHT_LINK"] || "https://testflight.apple.com/join/dLPPHyYi";

export const ldClientSideId =
  process.env["NEXT_PUBLIC_LD_CLIENT_SIDE_ID"] || "63d107d49c970a13671687f3";
