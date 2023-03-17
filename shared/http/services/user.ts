import type { Auth } from "firebase/auth";
import type { AxiosResponse } from "axios";
import { getComputedAuth } from "@/shared/context/global";
import http from "../client";
import { GCUser, IdentityBasics, KycTaxInfo, UserAddress } from "../types";
import { urlPaths } from "../util";

export const createUser = async (auth: Auth | null) => {
  if (!auth) throw new Error("not authenticated");

  const jwt = await getComputedAuth()?.currentUser?.getIdToken();

  if (!jwt) throw new Error("not authenticated");

  const res = await http.post<any, AxiosResponse<GCUser>>(urlPaths.USER_ME_CREATE, {
    jwt,
  });

  return res.data;
};

export const updateUserAddress = async (payload: UserAddress) => {
  const res = await http.post<any, AxiosResponse<UserAddress>>(urlPaths.KYC_ADDRESS, payload);

  return res.data;
};

export const updateUserIdentityBasic = async (payload: IdentityBasics) => {
  const res = await http.post<any, AxiosResponse<IdentityBasics>>(
    urlPaths.KYC_IDENTITY_BASICS,
    payload
  );

  return res.data;
};

export const updateTaxInfo = async (payload: KycTaxInfo) => {
  const res = await http.post<any, AxiosResponse<KycTaxInfo>>(urlPaths.KYC_TAX_INFO, payload);

  return res.data;
};

export const submitKyc = async () => {
  const res = await http.post<any, AxiosResponse<{ locId: string }>>(
    urlPaths.KYC_ATTEMPT_SUBMIT,
    null,
    { timeout: 40_000 }
  );

  return res.data;
};

export const createPierBorrower = async () => {
  const res = await http.post<any, AxiosResponse<{ id: string }>>(urlPaths.USER_CREATE_BORROWER);

  return res.data;
};

export const createPierApplication = async (borrowerId: string) => {
  const res = await http.post<any, AxiosResponse<{ id: string }>>(
    urlPaths.USER_CREATE_APPLICATION,
    { borrowerId }
  );

  return res.data;
};

export const approvePierApplication = async (applicationId: string) => {
  const res = await http.post<any, AxiosResponse<{ id: string }>>(
    urlPaths.USER_APPROVE_APPLICATION,
    { applicationId }
  );

  return res.data;
};

export const createPierLoanAgreement = async (applicationId: string) => {
  const res = await http.post<any, AxiosResponse<{ id: string; documentUrl: string }>>(
    urlPaths.USER_CREATE_LOAN_AGREEMENT,
    { applicationId }
  );

  return res.data;
};

export const signPierLoanAgreement = async (loanAgreementId: string) => {
  const res = await http.post<any, AxiosResponse<{ id: string; documentUrl: string }>>(
    urlPaths.USER_SIGN_LOAN_AGREEMENT,
    { loanAgreementId }
  );

  return res.data;
};

export const createPierFacility = async (loanAgreementId: string) => {
  const res = await http.post<any, AxiosResponse<{ id: string }>>(urlPaths.USER_CREATE_FACILITY, {
    loanAgreementId,
  });

  return res.data;
};

export const completeUserOnboarding = async () => {
  const res = await http.post(urlPaths.USER_COMPLETE_ONBOARDING);

  return res.data;
};
