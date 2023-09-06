import { CachedUserInfo, ELocalStorageKeys } from "@/utils/types";
import { ParsedUrlQuery } from "querystring";
import { Auth } from "firebase/auth";

export const urlPaths = {
  USER_ME: "/v1/me",
  USER_ME_CREATE: "/v1/me/create",
  USER_ME_BANK_ACCOUNT_INFO: "/v1/me/bank-account-info",
  KYC_ATTEMPT: "/v1/me/kyc_attempt",
  KYC_IDENTITY_BASICS: "/v1/me/kyc_attempt/identity_basics",
  KYC_ADDRESS: "/v1/me/kyc_attempt/address",
  KYC_TAX_INFO: "/v1/me/kyc_attempt/tax_info",
  KYC_IDENTITY: "/v1/me/kyc_attempt/identity",
  BANK_ACCOUNT_CREATE: "/v1/bank-accounts/create",
  BANK_ACCOUNT_FAIL: "/v1/bank-accounts/fail",
  BANK_ACCOUNT_STATUS: "/v1/bank-accounts/status",
  PLAID_LINK_TOKEN: "/v1/bank-accounts/link-token",
  KYC_PLAID_LINK_TOKEN: "/v1/me/kyc_attempt/kyc-link-token",
  KYC_ATTEMPT_SUBMIT: "/v1/me/kyc_attempt/submit",
  KYC_SUBMISSION_STATUS: "/v1/me/kyc_attempt/status",
  USER_SETTINGS: "/v1/user-settings",
  LOC: "/v1/lines_of_credit",
  LOC_BALANCE: "/v1/lines_of_credit/:line_of_credit_id/balance",
  CARD_URL: "/v1/cards/",
  TRANSACTIONS_LIST: "/v1/transactions/list-loc-transactions",
  USER_ONBOARDING_VERSION: "/v1/onboarding",
  USER_ONBOARDING: "/v1/me/onboarding",
  PATCH_USER_ONBOARDING: "/v1/me/onboarding",
  USER_COMPLETE_ONBOARDING: "/v1/me/complete-onboarding",
  USER_ASSET_STATUS: "/v1/me/asset-status",
  UNDERWRITING: "/v1/underwriting",
  UNDERWRITING_FAIL: "/v1/underwriting/fail",
  LOAN_AGREEMENTS_COVERAGE: "/v1/loan-agreements/coverage",
  LOAN_AGREEMENTS: "/v1/loan-agreements",
  LOAN_AGREEMENTS_APPLICATIONS: "/v1/loan-agreements/applications",
  LOAN_AGREEMENTS_APPLICATION_APPROVE: "/v1/loan-agreements/applications/approve",
  LOAN_AGREEMENTS_COMPLETE: "/v1/loan-agreements/complete",
  BANK_LOC_STATUS: "/v1/bank-account/status",
  CREATE_FUNDING_CARD: "/v1/funding-card",
  VERIFY_FUNDING_CARD: "/v1/funding-card/verify",
} as const;

/**
 * @param cb callback which will be called every iteration of longpoll
 * @param check callback which will check if response from cb has expected value
 * @param timeout timeout between every longpoll iteration
 * @param attempts amount of attempts of longpoll iterations before returns fallback value.
 *                   Will be infinite if the value is 0 (default)
 * @param fallback fallback value to return if all attempts are used up
 * @returns first expected value which is satisfied by check callback, or fallback value (if attempts are provided)
 */
export const longPoll = async <R>(
  cb: () => Promise<R>,
  check: (response: R) => boolean,
  timeout = 500,
  attempts = 0,
  fallback?: R
): Promise<R> => {
  let attemptsTried = 0;

  return new Promise((resolve) => {
    const startPolling = async (): Promise<any> => {
      try {
        const response = await cb();
        const expectedResponse = check(response);

        attemptsTried++;

        if (!expectedResponse)
          return attempts > 0 && attemptsTried >= attempts
            ? resolve(fallback!)
            : setTimeout(startPolling, timeout);

        return resolve(response);
      } catch {
        attemptsTried++;

        attempts > 0 && attemptsTried >= attempts
          ? resolve(fallback!)
          : setTimeout(startPolling, timeout);
      }
    };

    startPolling();
  });
};

export const saveUserToCache = async (
  auth: Auth | null,
  partialCachedUserInfo: Omit<CachedUserInfo, "auth_token">
) => {
  const auth_token = (await auth?.currentUser?.getIdToken()) as string;

  const cachedUserInfo: CachedUserInfo = {
    auth_token,
    ...partialCachedUserInfo,
  };

  if (auth_token)
    localStorage.setItem(ELocalStorageKeys.CACHED_USER_INFO, JSON.stringify(cachedUserInfo));
};

export const getUserInfoFromCache = (): CachedUserInfo | null => {
  const cachedUserInfoJson = localStorage.getItem(ELocalStorageKeys.CACHED_USER_INFO);
  let cachedUserInfo: CachedUserInfo | null = null;

  if (cachedUserInfoJson) {
    try {
      cachedUserInfo = JSON.parse(cachedUserInfoJson);
    } catch (error) {
      console.error("Error parsing cached user info JSON:", error);
    }
  }

  return cachedUserInfo;
};

export const popUserInfoFromCache = () =>
  localStorage.removeItem(ELocalStorageKeys.CACHED_USER_INFO);

export const navigateWithQuery = (query: ParsedUrlQuery, baseUrl: string) => {
  const queryString = Object.keys(query)
    .map((key) => `${key}=${query[key]}`)
    .join("&");
  const urlWithQuery = `${baseUrl}?${queryString}`;
  return urlWithQuery;
};
