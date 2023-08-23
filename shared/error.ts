import { AxiosError } from "axios";

export const parseApiError = (error: AxiosError<{ message?: string }>) => {
  const message = error?.response?.data.message;

  const data: ErrorObject | null = message ? attemptParse(message) : null;

  return data;
};

const attemptParse = (jsonString: string | object): ErrorObject | null => {
  if (typeof jsonString === "object") return jsonString as ErrorObject;

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
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
}

export enum EUserError {
  MAX_USERS = "USER0001",
  MAS_LIVE_USERS = "USER0002",
  FUNDING_CARD_GLOBAL_LIMIT_REACHED = "USER0005",
}

export const userLimitErrors = [
  EUserError.MAX_USERS,
  EUserError.MAS_LIVE_USERS,
  EUserError.FUNDING_CARD_GLOBAL_LIMIT_REACHED,
];
