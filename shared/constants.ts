import type { OnboardingStep, Plan } from "./types";

export const onboardingStepToPageMap: Record<OnboardingStep, string> = {
  WELCOME: "/onboarding",
  PHONE_VERIFICATION: "/onboarding/verify",
  CONTACT_INFO: "/onboarding/contact-info",
  KYC: "/onboarding/kyc",
  BANK_ACCOUNT_CONNECTION: "/onboarding/connect-bank-account",
  PROCESSING_APPLICATION: "/onboarding/processing-application",
  DOC_GENERATION: "/onboarding/doc-generation",
  REFERRAL_SOURCE: "/onboarding/how-did-you-hear",
  APPLICATION_COMPLETE: "/onboarding/application-complete",
  READY_TO_JOIN: "/onboarding/ready-to-join",
  THANKS_FOR_JOINING: "/onboarding/thanks-for-joining",
  NEW_CARD_ON_THE_WAY: "/onboarding/new-card-on-the-way",
};

/** This should be replaced with plans from Db in the future */
export const hardcodedPlans = {
  MONTHLY: {
    id: "1",
    name: "5.99 Monthly Subscription",
    planType: "UNIFORM",
    frequency: "MONTHLY",
    price: 5.99,
    currency: "USD",
    productId: "1",
  } as Plan,
  ANNUAL: {
    id: "2",
    name: "72 Annual Subscription",
    planType: "UNIFORM",
    frequency: "ANNUAL",
    price: 72,
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

export const hardcodedPlan: Plan = hardcodedPlans.ANNUAL;
