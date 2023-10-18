import { EProgressLoaderText, EProgressLoaderTitle } from "../utils/types";
import type { OnboardingStep, Plan } from "./types";

export const onboardingStepToPageMap: Record<OnboardingStep, string> = {
  USER_IDENTITY_COLLECTION: "/onboarding",
  USER_IDENTITY_VERIFICATION: "onboarding/verify",
  USER_CONTACT_INFO: "contact-info",
  BANK_ACCOUNT_LINKING: "connect-bank-account",
  PAYMENT_METHOD_VERIFICATION: "processing-application",
  LOAN_APPLICATION_SUBMISSION: "ready-to-join",
  LOAN_AGREEMENT_CREATION: "doc-generation",
  ONBOARDING_COMPLETION: "application-complete",
  APP_DOWNLOAD: "app-download",
  FUNDING_CARD_LINKING: "connect-debit-card",
};

export const webAppRoutes = {
  LOGIN: "login",
  VERIFY: "verify",
  HOME: "home",
};

/** This should be replaced with plans from Db in the future */
export const hardcodedPlans = {
  1: {
    id: "1",
    name: "6 Monthly Subscription",
    planType: "UNIFORM",
    frequency: "MONTHLY",
    price: 6,
    currency: "USD",
    productId: "1",
  } as Plan,
  2: {
    id: "2",
    name: "72 Annual Subscription",
    planType: "UNIFORM",
    frequency: "ANNUAL",
    price: 72,
    currency: "USD",
    productId: "1",
  } as Plan,
  3: {
    id: "3",
    name: "0 Annual Subscription",
    planType: "UNIFORM",
    frequency: "ANNUAL",
    price: 0,
    currency: "USD",
    productId: "1",
  } as Plan,
};

export const appStoreAppUrl = "https://apps.apple.com/us/app/goodcash-card/id1636346143";
export const playStoreAppUrl = "https://play.google.com/store/apps/details?id=com.goodcashmobile";
export const waitListUrl = "https://goodcash.com";
export const termsOfServiceUrl = "https://bit.ly/goodcash-terms";
export const privacyPolicyUrl = "https://bit.ly/goodcash-privacy";
export const bankPrivacyPolicyUrl =
  "https://bankpatriot.com/PatriotBank/media/Documents/Privacy_Policy.pdf";
export const cardHolderAgreementUrl = "https://bit.ly/goodcash-cardholder";
export const eSignConsentUrl =
  "https://uploads-ssl.webflow.com/6332899ac4c8cd82e1f261b5/6480dd5556b22a3e2993dc0d_E-SIGN%20Consent.pdf";

export const defaultPlanId = 2;
export const freePlanId = 3;
export const hardcodedPlan: Plan = hardcodedPlans[defaultPlanId];

export enum OnboardingFlowName {
  BANK_ACCOUNT_FUNDING = "bank-account-funding",
  DEBIT_CARD_FUNDING = "debit-card-funding",
}

export const OnboardingFlowVersionsMap: Record<number, OnboardingFlowName> = {
  0: OnboardingFlowName.BANK_ACCOUNT_FUNDING,
  1: OnboardingFlowName.DEBIT_CARD_FUNDING,
};

export const ProgressLoaderDefs = {
  LOADING: {
    title: EProgressLoaderTitle.LOADING,
    text_line_1: EProgressLoaderText.LOADING_LINE_1,
    text_line_2: EProgressLoaderText.LOADING_LINE_2,
    duration: 5000,
  },
  VERIFYING: {
    title: EProgressLoaderTitle.VERIFYING,
    text_line_1: EProgressLoaderText.VERIFYING_LINE_1,
    text_line_2: EProgressLoaderText.VERIFYING_LINE_2,
    duration: 5000,
  },
  PROCESSING_APPLICATION: {
    title: EProgressLoaderTitle.PROCESSING_APPLICATION,
    text_line_1: EProgressLoaderText.PROCESSING_APPLICATION_LINE_1,
    text_line_2: EProgressLoaderText.PROCESSING_APPLICATION_LINE_2,
    duration: 10000,
  },
  FINALIZING: {
    title: EProgressLoaderTitle.FINALIZING,
    text_line_1: EProgressLoaderText.FINALIZING_LINE_1,
    text_line_2: EProgressLoaderText.FINALIZING_LINE_2,
    duration: 10000,
  },
};

export const OnboardingErrorDefs = {
  PLAID_IDV_FAILED: "PI_400",
  STRIPE_FUNDING_CARD_ERROR: "SFC_400",
  BANK_ACCOUNT_CREATION_FAILED: "BAC_400",
  LOAN_AGREEMENT_CREATION_FAILED: "LA_400",
  LOAN_AGREEMENT_SIGN_FAILED: "LAS_400",
  LOAN_AGREEMENT_COMPLETION_FAILED: "LAC_400",
};
