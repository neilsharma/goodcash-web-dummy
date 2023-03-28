import type { IOnboardingContext } from "./context/onboarding";

export enum EUsaStates {
  AL = "AL",
  AK = "AK",
  AZ = "AZ",
  AR = "AR",
  CA = "CA",
  CO = "CO",
  CT = "CT",
  DE = "DE",
  DC = "DC",
  FL = "FL",
  GA = "GA",
  HI = "HI",
  ID = "ID",
  IL = "IL",
  IN = "IN",
  IA = "IA",
  KS = "KS",
  KY = "KY",
  LA = "LA",
  ME = "ME",
  MD = "MD",
  MA = "MA",
  MI = "MI",
  MN = "MN",
  MS = "MS",
  MO = "MO",
  MT = "MT",
  NE = "NE",
  NV = "NV",
  NH = "NH",
  NJ = "NJ",
  NM = "NM",
  NY = "NY",
  NC = "NC",
  ND = "ND",
  OH = "OH",
  OK = "OK",
  OR = "OR",
  PA = "PA",
  RI = "RI",
  SC = "SC",
  SD = "SD",
  TN = "TN",
  TX = "TX",
  UT = "UT",
  VT = "VT",
  VA = "VA",
  WA = "WA",
  WV = "WV",
  WI = "WI",
  WY = "WY",
}

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type OnboardingStep =
  | "WELCOME"
  | "PHONE_VERIFICATION"
  | "PLAN_SELECTION_AND_USER_CREATION"
  | "CONTACT_INFO"
  | "BANK_ACCOUNT_CONNECTION"
  | "FINALIZING_APPLICATION"
  | "DOC_GENERATION"
  | "REFERRAL_SOURCE"
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
  | "pierBorrowerId"
  | "pierApplicationId"
  | "pierLoanAgreementId"
  | "pierLoanAgreementDocumentUrl"
  | "pierFacilityId"
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
