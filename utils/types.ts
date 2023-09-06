import { PlanFrequency } from "../shared/types";

export enum ETrackEvent {
  // Existing events
  USER_LOGGED_IN_SUCCESSFULLY = "User Logged In",
  USER_LOGGED_IN_FAILED = "User Log In Failed",
  USER_HEARD_ABOUT_US = "User Heard About Us Clicked",
  USER_STATE_VALIDATION_FAILED = "User State Validation Failed",
  USER_CLOSED_BROWSER_TAB = "User Closed Browser Tab",

  //card events
  ADD_FUNDING_CARD_SUCCESS = "Add Funding Card Success",
  ADD_FUNDING_CARD_FAILED = "Add Funding Card Failed",
}

export enum EScreenEventTitle {
  ONBOARDING = "Onboarding Index",
  PLAN = "Plan",
  VERIFY = "Verify Phone Number",
  USER_ID_BLOCKED = "User Id Blocked",
  SOMETHING_WENT_WRONG = "Something Went Wrong",
  NOT_ENOUGH_MONEY = "Insufficient Bank Account Balance",
  HOW_DID_YOU_HEAR = "How Did You Hear",
  PROCESSING_APPLICATION = "Processing Application",
  DOC_GENERATION = "Loan Agreement Doc Generation",
  CONTACT_INFO = "Identity Data Collection Form",
  CONNECT_BANK_ACCOUNT = "Connect Bank Account",
  APPLICATION_COMPLETE = "Application Complete",
  CQR = "CQR",
  KYC = "KYC Identity Verification",
  UNSUPPORTED_STATE = "Unsupported State",
  READY_TO_JOIN = "Ready To Join",
  THANKS_FOR_JOINING = "Thanks For Joining",
  NEW_CARD_ON_THE_WAY = "New Card On The Way",
  CARD_VERIFICATION = "Card Verification",
}

export type ScreenTrackEvent = `${EScreenEventTitle} Viewed`;

export interface IGCAnalyticsData {
  [key: string]: string | number | boolean | undefined | Record<string, unknown>;
}

export enum GTagEventName {
  "purchase" = "purchase",
  "signUp" = "sign_up",
  "login" = "login",
  "addPaymentInfo" = "add_payment_info",
  "setUserId" = "set_user_id",
}

export type PropertyType =
  | number
  | string
  | boolean
  | Array<string | number>
  | {
      [key: string]: PropertyType;
    };
export type AnalyticsEventProperties = Record<string, string>;
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

export enum ELocalStorageKeys {
  LINK_TOKEN = "link_token",
  CACHED_USER_INFO = "cached_user_info",
  CARD_VERIFICATION_DATA = "card_verification_data",
}

export type CachedUserInfo = {
  auth_token: string;
  phone: string;
  email: string;
  state: string;
  userId: string;
};

export const resolveText = (frequency: PlanFrequency) => {
  switch (frequency) {
    case "DAILY":
      return "day";
    case "WEEKLY":
      return "week";
    case "THIRTY_DAYS":
      return "thirty days";
    case "MONTHLY":
      return "month";
    case "ANNUAL":
      return "year";
    default:
      return "month";
  }
};

export enum ESentryEvents {
  USER_PHONE_EMAIL_CHECK = "User Phone Email Check",
}

export interface IUserAddress {
  addressLine1: string;
  addressLine2: string;
  state: string;
  city: string;
  zipCode: string;
}
