import type { FirebaseOptions } from "firebase/app";

export type GoodcashEnvironment = "local" | "sandbox" | "production";

export const goodcashEnvironment: GoodcashEnvironment =
  (process.env["NEXT_PUBLIC_GOODCASH_ENVIRONMENT"] as GoodcashEnvironment) ?? "local";

export const domain = process.env["NEXT_PUBLIC_DOMAIN"];
export const isLocalhost = domain?.startsWith("http://localhost");

export const firebaseConfig = JSON.parse(
  process.env["NEXT_PUBLIC_FIREBASE_CONFIG"] ?? ""
) as FirebaseOptions;

export const kardTermsVersion = process.env["NEXT_PUBLIC_KARD_TERMS_VERSION"];
export const appStoreId = "";
export const googlePlayId = "";
export const testFlightLink = process.env["NEXT_PUBLIC_TEST_FLIGHT_LINK"] || "";

export const ldClientSideId = process.env["NEXT_PUBLIC_LD_CLIENT_SIDE_ID"] || "";

export const getBaseUrl = () => {
  return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
};

export const gtagId = <string>process.env["NEXT_PUBLIC_GTAG_ID"];
