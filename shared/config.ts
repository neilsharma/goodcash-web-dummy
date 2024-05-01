export type GoodcashEnvironment = "local" | "sandbox" | "production";

export const goodcashEnvironment: GoodcashEnvironment =
  (process.env["NEXT_PUBLIC_GOODCASH_ENVIRONMENT"] as GoodcashEnvironment) ?? "local";

export const domain = process.env["NEXT_PUBLIC_DOMAIN"];
export const isLocalhost = domain?.startsWith("http://localhost");

export const firebaseConfig = {
  apiKey: "AIzaSyB02xkZqCrbbt5hSvGJP4KYA1lA0fCidpw",
  authDomain: "honor-card.firebaseapp.com",
  databaseURL: "https://honor-card-default-rtdb.firebaseio.com",
  projectId: "honor-card",
  storageBucket: "honor-card.appspot.com",
  messagingSenderId: "908886560721",
  appId: "1:908886560721:web:0d759cc8134f81788d1af0",
  measurementId: "G-3WL4623FLX",
};

// export const firebaseConfig = JSON.parse(
// process.env["NEXT_PUBLIC_FIREBASE_CONFIG"] ?? ""
// ) as FirebaseOptions;

export const kardTermsVersion = process.env["NEXT_PUBLIC_KARD_TERMS_VERSION"];
export const appStoreId = "";
export const googlePlayId = "";
export const testFlightLink = process.env["NEXT_PUBLIC_TEST_FLIGHT_LINK"] || "";

export const ldClientSideId = process.env["NEXT_PUBLIC_LD_CLIENT_SIDE_ID"] || "";
export const fbPixelId = process.env["NEXT_PUBLIC_FACEBOOK_PIXEL_ID"] || "";

export const getBaseUrl = () => {
  return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
};

export const gtagId = <string>process.env["NEXT_PUBLIC_GTAG_ID"];
