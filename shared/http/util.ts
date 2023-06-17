import { CachedUserInfo, ELocalStorageKeys } from "@/utils/types";

export const urlPaths = {
  USER_ME: "/v1/me",
  USER_ME_CREATE: "/v1/me/create",
  USER_ME_BANK_ACCOUNT_INFO: "/v1/me/bank-account-info",
  KYC_ATTEMPT: "/v1/me/kyc_attempt",
  KYC_IDENTITY_BASICS: "/v1/me/kyc_attempt/identity_basics",
  KYC_ADDRESS: "/v1/me/kyc_attempt/address",
  KYC_TAX_INFO: "/v1/me/kyc_attempt/tax_info",
  KYC_IDENTITY: "/v1/me/kyc_attempt/identity",
  KYC_BANK_ACCOUNT: "/v1/me/kyc_attempt/bank-account",
  KYC_BANK_ACCOUNT_FAIL: "/v1/me/kyc_attempt/bank-account/fail",
  PLAID_LINK_TOKEN: "/v1/me/kyc_attempt/link-token",
  KYC_PLAID_LINK_TOKEN: "/v1/me/kyc_attempt/kyc-link-token",
  KYC_ATTEMPT_SUBMIT: "/v1/me/kyc_attempt/submit",
  USER_SETTINGS: "/v1/user-settings",
  LOC: "/v1/lines_of_credit",
  LOC_BALANCE: "/v1/lines_of_credit/:line_of_credit_id/balance",
  CARD_URL: "/v1/cards/",
  TRANSACTIONS_LIST: "/v1/transactions/list-loc-transactions",
  USER_ONBOARDING: "/v1/me/onboarding",
  USER_COMPLETE_ONBOARDING: "/v1/me/complete-onboarding",
  USER_ASSET_STATUS: "/v1/me/asset-status",
  UNDERWRITING: "/v1/underwriting",
  UNDERWRITING_FAIL: "/v1/underwriting/fail",
  LOAN_AGREEMENTS_COVERAGE: "/v1/loan-agreements/coverage",
  LOAN_AGREEMENTS: "/v1/loan-agreements",
  LOAN_AGREEMENTS_APPLICATIONS: "/v1/loan-agreements/applications",
  LOAN_AGREEMENTS_APPLICATION_APPROVE: "/v1/loan-agreements/applications/approve",
  LOAN_AGREEMENTS_COMPLETE: "/v1/loan-agreements/complete",
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
      const response = await cb();
      const expectedResponse = check(response);

      attemptsTried++;

      if (!expectedResponse)
        return attempts > 0 && attemptsTried >= attempts
          ? resolve(fallback!)
          : setTimeout(startPolling, timeout);

      return resolve(response);
    };

    startPolling();
  });
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
