export type GCUserState = "LIVE" | "DELETED" | "ONBOARDING" | "BLOCKED";

export interface GCUser {
  id: string;
  state: GCUserState;
  firebaseUid: string | null;
  lithicAccount: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAddress {
  address_line_1: string;
  address_line_2?: string;
  address_line_3?: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface IdentityBasics {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  birth_date?: string;
  email_address?: string;
}

export interface CreateBankAccount {
  plaidPublicToken: string;
}

export interface KycTaxInfo {
  social_security_number: string;
}

export interface UnderwritingResponse {
  id: string;
  status: UnderwritingStatus;
  bankAccountAssetId: string;
}

export interface UserSession {
  fbc?: string;
  fbp?: string;
}

export type AssetStatus = "PENDING" | "MANUAL_REVIEW" | "APPROVED" | "DENIED";
export type UnderwritingStatus = "PENDING" | "MANUAL_REVIEW" | "APPROVED" | "DENIED";
export type UserStateCoverageMap = {
  [key: string]: boolean;
};
