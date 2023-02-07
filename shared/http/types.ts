export type GCUserState = "LIVE" | "DELETED" | "ONBOARDING";

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
