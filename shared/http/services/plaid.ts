import type { AxiosResponse } from "axios";
import http from "../client";
import { CreateBankAccount, FailBankAccountCreation } from "../types";
import { urlPaths } from "../util";

export const getPlaidToken = async () => {
  const res = await http.post<any, AxiosResponse<string>>(urlPaths.PLAID_LINK_TOKEN);

  return res.data;
};

export const getKycPlaidToken = async (payload: GetKycPlaidTokenPayload) => {
  const res = await http.post<any, AxiosResponse<string>>(urlPaths.KYC_PLAID_LINK_TOKEN, payload);

  return res.data;
};

interface GetKycPlaidTokenPayload {
  phone: string;
  email: string;
}

export const createBankAccount = async (payload: CreateBankAccount) => {
  const res = await http.post<any, AxiosResponse<string>>(urlPaths.KYC_BANK_ACCOUNT, payload, {
    timeout: 0,
  });

  return res.data;
};

export const failBankAccountCreation = async (payload: FailBankAccountCreation) => {
  const res = await http.post<any, AxiosResponse<string>>(urlPaths.KYC_BANK_ACCOUNT_FAIL, payload);

  return res.data;
};
