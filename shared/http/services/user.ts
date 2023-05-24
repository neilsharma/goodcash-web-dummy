import type { Auth, User } from "firebase/auth";
import type { AxiosResponse } from "axios";
import { getComputedAuth } from "@/shared/context/global";
import http from "../client";
import {
  AssetStatus,
  GCUser,
  IdentityBasics,
  KycTaxInfo,
  UserStateCoverageMap,
  UserAddress,
} from "../types";
import { urlPaths } from "../util";
import { EUsaStates, RecursivePartial, SharedOnboardingState } from "@/shared/types";

export const createUser = async (auth: Auth | null) => {
  if (!auth) throw new Error("not authenticated");

  const jwt = await getComputedAuth()?.currentUser?.getIdToken();

  if (!jwt) throw new Error("not authenticated");

  const res = await http.post<any, AxiosResponse<GCUser>>(urlPaths.USER_ME_CREATE, {
    jwt,
  });

  return res.data;
};

export const getUser = async (token: string) => {
  const res = await http.get<any, AxiosResponse<GCUser | null>>(urlPaths.USER_ME, {
    headers: { "goodcash-authorization": token },
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

export const fillKYCIdentity = async (payload: { sessionId: string }) => {
  const res = await http.post<any, AxiosResponse<"OK">>(urlPaths.KYC_IDENTITY, {
    source: "Plaid",
    data: payload,
  });

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

export const getUserOnboarding = async (token: string) => {
  const res = await http.get<any, AxiosResponse<RecursivePartial<SharedOnboardingState> | null>>(
    urlPaths.USER_ONBOARDING,
    {
      headers: { "goodcash-authorization": token },
    }
  );

  return res.data;
};

export const patchUserOnboarding = async (data: RecursivePartial<SharedOnboardingState>) => {
  const res = await http.patch(urlPaths.USER_ONBOARDING, data);

  return res.data;
};

export const completeUserOnboarding = async () => {
  const res = await http.post(urlPaths.USER_COMPLETE_ONBOARDING);

  return res.data;
};

export const getUserStateCoverageMap = async () => {
  const res = await http.get<any, AxiosResponse<UserStateCoverageMap>>(
    urlPaths.USER_STATE_COVERAGE
  );

  return res.data;
};

export const getAssetStatus = async () => {
  const res = await http.get<any, AxiosResponse<AssetStatus>>(urlPaths.USER_ASSET_STATUS);

  return res.data;
};
