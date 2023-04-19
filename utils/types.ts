export enum ETrackEvent {
  // Analytics events listed here
  SCREEN_TRACK = "SCREEN_TRACK",
  USER_LOGGED_IN_SUCCESSFULLY = "USER_LOGGED_IN_SUCCESSFULLY",
  USER_LOGGED_IN_FAILED = "USER_LOGGED_IN_FAILED",
}
export enum EScreenEventTitle {
  ONBOARDING_SCREEN = "onboarding_screen",
  PLAN_SCREEN = "plan_screen",
  VERIFY_SCREEN = "verify_screen",
  USER_ID_BLOCKED_SCREEN = "user_id_blocked_screen",
  SOMETHING_WENT_WRONG_SCREEN = "something_went_wrong_screen",
  NOT_ENOUGH_MONEY_SCREEN = "not_enough_money_screen",
  HOW_DID_YOU_HEAR_SCREEN = "how_did_you_hear_screen",
  FINALIZING_APPLICATION_SCREEN = "finalizing_application_screen",
  DOC_GENERATION_SCREEN = "doc_generation_screen",
  CONTACT_INFO_SCREEN = "contact_info_screen",
  CONNECT_BANK_ACCOUNT_SCREEN = "connect_bank_account_screen",
  APPLICATION_COMPLETE_SCREEN = "application_complete_screen",
  CQR_SCREEN = "cqr_screen",
}

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
