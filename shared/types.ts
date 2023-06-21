import { hardcodedPlans } from "./constants";
import type { IOnboardingContext } from "./context/onboarding";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export enum EUsaStates {
  Alabama = "AL",
  Alaska = "AK",
  Arizona = "AZ",
  Arkansas = "AR",
  California = "CA",
  Colorado = "CO",
  Connecticut = "CT",
  Delaware = "DE",
  "District of Columbia" = "DC",
  Florida = "FL",
  Georgia = "GA",
  Hawaii = "HI",
  Idaho = "ID",
  Illinois = "IL",
  Indiana = "IN",
  Iowa = "IA",
  Kansas = "KS",
  Kentucky = "KY",
  Louisiana = "LA",
  Maine = "ME",
  Maryland = "MD",
  Massachusetts = "MA",
  Michigan = "MI",
  Minnesota = "MN",
  Mississippi = "MS",
  Missouri = "MO",
  Montana = "MT",
  Nebraska = "NE",
  Nevada = "NV",
  "New Hampshire" = "NH",
  "New Jersey" = "NJ",
  "New Mexico" = "NM",
  "New York" = "NY",
  "North Carolina" = "NC",
  "North Dakota" = "ND",
  Ohio = "OH",
  Oklahoma = "OK",
  Oregon = "OR",
  Pennsylvania = "PA",
  "Rhode Island" = "RI",
  "South Carolina" = "SC",
  "South Dakota" = "SD",
  Tennessee = "TN",
  Texas = "TX",
  Utah = "UT",
  Vermont = "VT",
  Virginia = "VA",
  Washington = "WA",
  "West Virginia" = "WV",
  Wisconsin = "WI",
  Wyoming = "WY",
}

export const EUsaStatesLookup: { [value: string]: string } = Object.entries(EUsaStates).reduce(
  (accumulator, [key, value]) => ({ ...accumulator, [value]: key }),
  {}
);

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type OnboardingStep =
  | "WELCOME"
  | "PHONE_VERIFICATION"
  | "CONTACT_INFO"
  | "KYC"
  | "BANK_ACCOUNT_CONNECTION"
  | "PROCESSING_APPLICATION"
  | "DOC_GENERATION"
  | "REFERRAL_SOURCE"
  | "READY_TO_JOIN"
  | "NEW_CARD_ON_THE_WAY"
  | "THANKS_FOR_JOINING"
  | "APPLICATION_COMPLETE";

export type SharedOnboardingState = Pick<
  IOnboardingContext,
  | "onboardingOperationsMap"
  | "onboardingStep"
  | "firstName"
  | "lastName"
  | "phone"
  | "email"
  | "plan"
  | "user"
  | "dateOfBirth"
  | "legalAddress"
  | "aptNumber"
  | "city"
  | "state"
  | "zipCode"
  | "ssn"
  | "agreedToCardHolderAgreement"
  | "agreedToAutopay"
  | "agreedToTermsOfService"
  | "plaid"
  | "locId"
  | "loanAgreementDocumentUrl"
  | "howDidYouHearAboutUs"
>;

export type PlanFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "THIRTY_DAYS" | "ANNUAL";
export interface Plan {
  id: string;
  name: string;
  planType: "UNIFORM";
  frequency: PlanFrequency;
  currency: "USD";
  price: number;
  productId: string;
}

export enum EOtpErrorCode {
  INVALID_OTP = "auth/invalid-verification-code",
}
