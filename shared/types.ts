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
  | "USER_IDENTITY_COLLECTION"
  | "USER_IDENTITY_VERIFICATION"
  | "USER_CONTACT_INFO"
  | "BANK_ACCOUNT_LINKING"
  | "PAYMENT_METHOD_VERIFICATION"
  | "LOAN_APPLICATION_SUBMISSION"
  | "LOAN_AGREEMENT_CREATION"
  | "ONBOARDING_COMPLETION"
  | "FUNDING_CARD_LINKING"
  | "APP_DOWNLOAD";

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

export interface UserOnboardingState {
  id: string;
  version: number;
  flowName: string;
  status: OnboardingStatus;
  steps: Record<OnboardingStepType, UserOnboardingStateStep>;
}

export interface OnboardingStatus {
  NOT_STARTED: "NOT_STARTED";
  IN_PROGRESS: "IN_PROGRESS";
  COMPLETED: "COMPLETED";
  FAILED: "FAILED";
}

export interface OnboardingStepStatus {
  NOT_STARTED: "NOT_STARTED";
  IN_PROGRESS: "IN_PROGRESS";
  COMPLETED: "COMPLETED";
  FAILED: "FAILED";
}

export interface UserOnboardingStateStep {
  status: OnboardingStepStatus;
  metadata: Record<string, any>;
  steps?: Record<OnboardingStepType, UserOnboardingStateStep>;
}

export enum OnboardingStepType {
  PRICING_PLAN_SELECTION = "PRICING_PLAN_SELECTION",
  USER_IDENTITY_COLLECTION = "USER_IDENTITY_COLLECTION",
  BANK_ACCOUNT_LINKING = "BANK_ACCOUNT_LINKING",
  PAYMENT_METHOD_VERIFICATION = "PAYMENT_METHOD_VERIFICATION",
  LOAN_APPLICATION_CREATION = "LOAN_APPLICATION_CREATION",
  LOAN_APPLICATION_PROCESSING = "LOAN_APPLICATION_PROCESSING",
  LOAN_APPLICATION_COMPLETION = "LOAN_APPLICATION_COMPLETION",
  LOAN_AGREEMENT_CREATION = "LOAN_AGREEMENT_CREATION",
  LOAN_AGREEMENT_COMPLETION = "LOAN_AGREEMENT_COMPLETION",
}

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
export type StepStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
export enum EStepStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}
type StandardErrorCode = string; // You might want to define a more specific type for error codes

interface StepMetadata {
  // Define the structure of step metadata if needed
}

export interface Step {
  status: String;
  metadata: StepMetadata;
}
export interface OnboardingSteps {
  BANK_ACCOUNT_LINKING: Step;
  PAYMENT_METHOD_VERIFICATION: Step;
  FUNDING_CARD_LINKING: Step;
  LOAN_APPLICATION_SUBMISSION: Step;
  LOAN_AGREEMENT_CREATION: Step;
  APP_DOWNLOAD: Step;
}

export interface OnboardingStepState<T = any> {
  [key: string]: {
    status: EStepStatus;
    metadata: Record<string, T>; // You can replace 'any' with a more specific type if needed
  };
}

export enum OnboardingStepEnum {
  USER_IDENTITY_COLLECTION = "user_identity_collection",
  USER_IDENTITY_VERIFICATION = "user_identity_verification",
  BANK_ACCOUNT_LINKING = "bank_account_linking",
  PAYMENT_METHOD_VERIFICATION = "PAYMENT_METHOD_VERIFICATION",
  LOAN_APPLICATION_SUBMISSION = "loan_application_submission",
  LOAN_APPLICATION_VERIFICATION = "loan_application_verification",
  LOAN_AGREEMENT_CREATION = "loan_agreement_creation",
  LOAN_AGREEMENT_COMPLETION = "loan_agreement_completion",
  ONBOARDING_COMPLETION = "onboarding_completion",
  APP_DOWNLOAD = "app_download",
}
export interface OnboardingProcess {
  id: string;
  version: number;
  status: EStepStatus;
  currentStep: keyof OnboardingSteps;
  steps: OnboardingSteps;
}
