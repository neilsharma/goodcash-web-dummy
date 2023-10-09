import { EScreenEventTitle } from "@/utils/types";
import { AxiosError } from "axios";
import { waitListUrl } from "./constants";

export const parseApiError = (error: AxiosError<{ message?: string }>) => {
  const message = error?.response?.data.message;

  const data: ErrorObject | null = message ? attemptParse(message) : null;

  return data;
};

export const extractApiErrorCode = (error: unknown) => {
  const errorCode =
    error instanceof AxiosError
      ? parseApiError(error as AxiosError<{ message?: string }>)?.errorCode
      : (error as any)?.code;

  return errorCode || ESupportedErrorCodes.GENERIC;
};

const attemptParse = (jsonString: string | object): ErrorObject | null => {
  if (typeof jsonString === "object") return jsonString as ErrorObject;

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
};

export const errorPageMap = {
  onboarding: "/onboarding/something-went-wrong",
};

interface ErrorObject {
  [key: string]: any;
  errorCode: string;
  errorInfo: string;
  message?: string;
}

export enum EOnboardingGenericErrors {
  BANK_CONNECTION_STEP_FAILED = "Bank connection step failed",
}

export enum BankAccountVerificationErrCodes {
  NOT_ENOUGH_MONEY = "UNDERWRITING0001",
  ASSET_CHECK_FAILED = "UNDERWRITING0002",
}

export enum EUserError {
  MAX_USERS = "USER0001",
  MAS_LIVE_USERS = "USER0002",
  FUNDING_CARD_GLOBAL_LIMIT_REACHED = "USER0005",
}

export enum EFundingCardError {
  FUNDING_CARD_BALANCE_CHECK_FAILED = "FUNDINGCARD0010",
  FUNDING_CARD_INVALID_STATE = "FUNDINGCARD0008",
  FUNDING_CARD_DECLINED = "FUNDINGCARD0007",
}

export const userLimitErrors = [
  EUserError.MAX_USERS,
  EUserError.MAS_LIVE_USERS,
  EUserError.FUNDING_CARD_GLOBAL_LIMIT_REACHED,
];

export interface ErrorData {
  title: string;
  subTitle1: string;
  subTittle2: string;
  screenEventTitle: EScreenEventTitle;
  tryAgainEnabled: boolean;
  tryAgainCallFunction?: () => any;
  tryAgainText: string;
  contactSupportEnabled: boolean;
  skipConfirmUnload: boolean;
}

export const defaultErrorData: ErrorData = {
  title: "Something went wrong",
  subTitle1: "Sorry, looks like something went wrong during your application process.",
  subTittle2:
    "Feel free to try again, and if the issue persists, please contact our support team and we’ll get this resolved right away.",
  screenEventTitle: EScreenEventTitle.GENERIC_ERROR,
  tryAgainEnabled: true,
  tryAgainText: "Try again",
  contactSupportEnabled: true,
  skipConfirmUnload: false,
};

const userBlockedError: Partial<ErrorData> = {
  subTittle2: "Most likely underwriting attempt failed. Contact our support for further questions.",
  screenEventTitle: EScreenEventTitle.USER_ID_BLOCKED,
  tryAgainEnabled: false,
};

export enum ESupportedErrorCodes {
  GENERIC = "GENERIC",
  USER_BLOCKED = "USER_BLOCKED",
  ASSET_CHECK_FAILED = BankAccountVerificationErrCodes.ASSET_CHECK_FAILED,
  NOT_ENOUGH_MONEY = BankAccountVerificationErrCodes.NOT_ENOUGH_MONEY,
  FUNDING_CARD_BALANCE_CHECK_FAILED = EFundingCardError.FUNDING_CARD_BALANCE_CHECK_FAILED,
  FUNDING_CARD_INVALID_STATE = EFundingCardError.FUNDING_CARD_INVALID_STATE,
  FUNDING_CARD_DECLINED = EFundingCardError.FUNDING_CARD_DECLINED,
  GENERIC_FUNDING_CARD_ERROR = "GENERIC_FUNDING_CARD_ERROR",
  STATE_NOT_SUPPORTED = "STATE_NOT_SUPPORTED",
}

export type SupportedErrorCodes = ESupportedErrorCodes | (string & {});

export const errorCodesToErrorPayloadMap: Record<SupportedErrorCodes, Partial<ErrorData>> = {
  [ESupportedErrorCodes.GENERIC]: defaultErrorData,
  [ESupportedErrorCodes.USER_BLOCKED]: userBlockedError,
  [ESupportedErrorCodes.ASSET_CHECK_FAILED]: userBlockedError,
  [ESupportedErrorCodes.NOT_ENOUGH_MONEY]: {
    title: "Your bank account is not eligible because average balance was too low.",
    subTitle1: "Unfortunately, you do not meet our eligibility requirement at the moment.",
    subTittle2: "We require you maintain a higher average bank account balance.",
    tryAgainText: "Try another account",
    contactSupportEnabled: false,
    screenEventTitle: EScreenEventTitle.NOT_ENOUGH_MONEY,
  },
  [ESupportedErrorCodes.FUNDING_CARD_BALANCE_CHECK_FAILED]: {
    title: "Your card is not eligible.",
    subTitle1: "Unfortunately, your card do not meet our eligibility requirement at the moment.",
    subTittle2: "We require higher card balance.",
    tryAgainText: "Try different card",
    screenEventTitle: EScreenEventTitle.FUNDING_CARD_BALANCE_CHECK_FAILED,
  },
  [ESupportedErrorCodes.FUNDING_CARD_INVALID_STATE]: {
    title: "Card validation failed",
    subTitle1: "Something failed during card validation process",
    subTittle2: "Try again or use different card",
    screenEventTitle: EScreenEventTitle.FUNDING_CARD_INVALID_STATE,
  },
  [ESupportedErrorCodes.FUNDING_CARD_DECLINED]: {
    title: "Your card was declined",
    subTitle1: "Unfortunately, your card was declined by your bank.",
    subTittle2: "Using this card is not possible at the moment.",
    tryAgainText: "Try different card",
    screenEventTitle: EScreenEventTitle.FUNDING_CARD_DECLINED,
  },
  [ESupportedErrorCodes.GENERIC_FUNDING_CARD_ERROR]: {
    subTitle1: "Sorry, looks like something went wrong during adding your card.",
    subTittle2: "Try again or different card",
    screenEventTitle: EScreenEventTitle.FUNDING_CARD_CREATION_FAILED,
  },
  [ESupportedErrorCodes.STATE_NOT_SUPPORTED]: {
    title: "We’re hoping to support your state soon!",
    subTitle1: "Unfortunately, your state isn’t supported at the moment.",
    subTittle2:
      "We’re working to support all states in the US, join our waitlist to be notified when we launch in your state!",
    tryAgainText: "Join waitlist",
    tryAgainCallFunction: () => (location.href = waitListUrl),
    skipConfirmUnload: true,
    screenEventTitle: EScreenEventTitle.UNSUPPORTED_STATE,
  },
};
