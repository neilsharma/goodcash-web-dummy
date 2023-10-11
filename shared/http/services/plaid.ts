import type { AxiosResponse } from "axios";
import http from "../client";
import { CreateBankAccount, FailBankAccountCreation, OnboardingStepStatus } from "../types";
import { longPoll, urlPaths } from "../util";

export const getPlaidToken = async () => {
  const res = await http.post<any, AxiosResponse<string>>(urlPaths.PLAID_LINK_TOKEN);

  return res.data;
};

export const getKycPlaidToken = async (payload: GetKycPlaidTokenPayload) => {
  const res = await http.post<any, AxiosResponse<string>>(urlPaths.KYC_PLAID_LINK_TOKEN, payload, {
    timeout: 60_000,
  });

  return res.data;
};

interface GetKycPlaidTokenPayload {
  phone: string;
  email: string;
}

export const createBankAccount = async (payload: CreateBankAccount) => {
  const res = await http.post<any, AxiosResponse<string>>(urlPaths.BANK_ACCOUNT_CREATE, payload, {
    timeout: 0,
  });

  return res.data;
};

export const fetchBankAccountCreationStatus = async () => {
  const res = await http.get<
    any,
    AxiosResponse<{ status: OnboardingStepStatus; error?: string | null }>
  >(urlPaths.BANK_ACCOUNT_STATUS);

  return res.data;
};

export const failBankAccountCreation = async (payload: FailBankAccountCreation) => {
  const res = await http.post<any, AxiosResponse<string>>(urlPaths.BANK_ACCOUNT_FAIL, payload);

  return res.data;
};

export const longPollBankCreation = async (
  expectedStatuses: OnboardingStepStatus[] = ["COMPLETED", "FAILED"],
  fallback = { status: "FAILED" as OnboardingStepStatus, error: null },
  timeout = 1000
) =>
  longPoll(
    fetchBankAccountCreationStatus,
    ({ status }) => expectedStatuses.includes(status),
    timeout,
    110,
    fallback
  );
