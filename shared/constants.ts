import type { OnboardingStep, Plan } from "./types";

export const onboardingStepToPageMap: Record<OnboardingStep, string> = {
  WELCOME: "/onboarding",
  PHONE_VERIFICATION: "/onboarding/verify",
  PLAN_SELECTION_AND_USER_CREATION: "/onboarding/plan",
  CONTACT_INFO: "/onboarding/contact-info",
  BANK_ACCOUNT_CONNECTION: "/onboarding/connect-bank-account",
  FINALIZING_APPLICATION: "/onboarding/finalizing-application",
  DOC_GENERATION: "/onboarding/doc-generation",
  REFERRAL_SOURCE: "/onboarding/how-did-you-hear",
  APPLICATION_COMPLETE: "/onboarding/application-complete",
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
};
