export enum ETrackEvent {
  // Analytics events listed here
  USER_LOGGED_IN_SUCCESSFULLY = "User Logged In",
  USER_LOGGED_IN_FAILED = "User Log In Failed",
  USER_HERD_ABOUT_US = "User Heard About Us Clicked",
}
export enum EScreenEventTitle {
  ONBOARDING = "Onboarding Index",
  PLAN = "Plan",
  VERIFY = "Verify Phone Number",
  USER_ID_BLOCKED = "User Id Blocked",
  SOMETHING_WENT_WRONG = "Something Went Wrong",
  NOT_ENOUGH_MONEY = "Insufficient Bank Account Balance",
  HOW_DID_YOU_HEAR = "How Did You Hear",
  FINALIZING_APPLICATION = "Finalizing Application",
  DOC_GENERATION = "Loan Agreement Doc Generation",
  CONTACT_INFO = "Identity Data Collection Form",
  CONNECT_BANK_ACCOUNT = "Connect Bank Account",
  APPLICATION_COMPLETE = "Application Complete",
  CQR = "CQR",
  KYC = "KYC Identity Verification",
}

export type ScreenTrackEvent = `${EScreenEventTitle} Viewed`;

export interface IGCAnalyticsData {
  [key: string]: string | number | boolean | undefined | Record<string, unknown>;
}

export type PropertyType =
  | number
  | string
  | boolean
  | Array<string | number>
  | {
      [key: string]: PropertyType;
    };
export type FirebaseUserProperties = Record<string, string>;
export type UserProperties = Record<string, PropertyType>;

export interface IGCUser {
  contactInfo: {
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    city: string;
    state: string;
    country: string;
    email: string;
    phone: string;
    zip: string;
    firstName: string;
    lastName: string;
  };
  id: string;
  state: GCUserState;
  firebaseUid: string | null;
  lithicAccount: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum GCUserState {
  LIVE = "LIVE",
  DELETED = "DELETED",
  ONBOARDING = "ONBOARDING",
  BLOCKED = "BLOCKED",
}
