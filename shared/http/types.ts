export type GCUserState = "LIVE" | "DELETED" | "ONBOARDING" | "BLOCKED";

export interface GCUser {
  id: string;
  state: GCUserState;
  firebaseUid: string | null;
  lithicAccount: string | null;
  createdAt: Date;
  updatedAt: Date;

  contactInfo: {
    phone: string | null;
    email: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    addressLine3: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    country: string | null;
    firstName: string | null;
    lastName: string | null;
  } | null;
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

export interface FailBankAccountCreation {
  error: {
    error_type: string;
    error_code: string;
    error_message: string; // developer friendly error message
    display_message: string;
  } | null;
  metadata: {
    institution: null | {
      name: string;
      institution_id: string;
    };
    // see possible values for status at https://plaid.com/docs/link/web/#link-web-onexit-status
    status: null | string;
    link_session_id: string;
    request_id: string;
  };
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
  gaSessionId?: string;
  gaSessionNumber?: string;
  gaClientId?: string;
  fbc?: string;
  fbp?: string;
  gclid?: string;
}

export type AssetStatus = "PENDING" | "MANUAL_REVIEW" | "APPROVED" | "DENIED";
export type UnderwritingStatus = "PENDING" | "MANUAL_REVIEW" | "APPROVED" | "DENIED";
export type UserStateCoverageMap = {
  [key: string]: boolean;
};
export interface LoanAgreement {
  applicationId: string | null;
  loanAgreementId: string | null;
  status: ELoanAgreementStatus;
  documentUrl: string | null;
}

export enum ELoanAgreementStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  COMPLETION_FAILED = "COMPLETION_FAILED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CREATED = "CREATED",
  CREATION_FAILED = "CREATION_FAILED",
  SIGNED = "SIGNED",
  SIGN_FAILED = "SIGN_FAILED",
  NOT_CREATED = "NOT_CREATED",
}

export type OnboardingStepStatus = "PENDING" | "FAILED" | "COMPLETED";

export type KYCAttempt = {
  id: string;
  state: KYCAttemptState;
  identityBasics: KYCFieldState;
  addressState: KYCFieldState;
  taxIdState: KYCFieldState;
  docState: KYCFieldState;
  bankConnectionState: KYCFieldState;
};

export enum KYCFieldState {
  PENDING = "PENDING",
  READY = "READY",
}

enum KYCAttemptState {
  IN_PROGRESS,
  SUBMITTED,
  PENDING_DOCUMENT,
  PENDING_RESUBMIT,
  ACCEPTED,
  REJECTED,
}
