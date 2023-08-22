import type { Auth } from "firebase/auth";
import type { AxiosResponse } from "axios";
import { getComputedAuth } from "@/shared/context/global";
import http from "../client";
import { longPoll, urlPaths } from "../util";
import {
  AssetStatus,
  GCUser,
  IdentityBasics,
  KycTaxInfo,
  UserAddress,
  KYCAttempt,
  OnboardingStepStatus,
} from "../types";
import { RecursivePartial, SharedOnboardingState, UserOnboardingState } from "@/shared/types";

export const createUser = async (auth: Auth | null, flowName?: string | string[]) => {
  if (!auth) throw new Error("not authenticated");

  const jwt = await getComputedAuth()?.currentUser?.getIdToken();

  if (!jwt) throw new Error("not authenticated");

  const payload: { jwt: string; flowName?: string | string[] } = { jwt };
  if (flowName) payload.flowName = flowName;

  const res = await http.post<any, AxiosResponse<GCUser>>(urlPaths.USER_ME_CREATE, payload);

  return res.data;
};

export const getUser = async (token?: string) => {
  const res = await http.get<any, AxiosResponse<GCUser | null>>(urlPaths.USER_ME, {
    ...(token ? { headers: { "goodcash-authorization": token } } : {}),
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
  const res = await http.post<any, AxiosResponse<void>>(urlPaths.KYC_ATTEMPT_SUBMIT, null, {
    timeout: 40_000,
  });

  return res.data;
};

export const fetchKycSubmissionStatus = async () => {
  const res = await http.get<any, AxiosResponse<OnboardingStepStatus>>(
    urlPaths.KYC_SUBMISSION_STATUS
  );

  return res.data;
};

export const longPollKycSubmissionStatus = async (
  expectedStatuses: OnboardingStepStatus[] = ["COMPLETED", "FAILED"],
  fallback = "FAILED" as OnboardingStepStatus,
  timeout = 500
) =>
  longPoll(
    fetchKycSubmissionStatus,
    (status) => expectedStatuses.includes(status),
    timeout,
    0,
    fallback
  );

export const getUserOnboardingVersion = async (token: string) => {
  const res = await http.get<any, AxiosResponse<RecursivePartial<UserOnboardingState> | null>>(
    urlPaths.USER_ONBOARDING_VERSION,
    {
      headers: { "goodcash-authorization": token },
    }
  );

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
  const res = await http.patch(urlPaths.PATCH_USER_ONBOARDING, data);

  return res.data;
};

export const completeUserOnboarding = async () => {
  const res = await http.post(urlPaths.USER_COMPLETE_ONBOARDING);

  return res.data;
};

export const getLatestKycAttempt = async () => {
  const res = await http.get<any, AxiosResponse<KYCAttempt>>(urlPaths.KYC_ATTEMPT);

  return res.data;
};

export const getAssetStatus = async () => {
  const res = await http.get<any, AxiosResponse<AssetStatus>>(urlPaths.USER_ASSET_STATUS);

  return res.data;
};
export const getBankLocStatus = async () => {
  const res = await http.get<any, AxiosResponse<OnboardingStepStatus>>(urlPaths.BANK_LOC_STATUS);

  return res.data;
};

const completedAssetStatuses = ["APPROVED", "DENIED"] as AssetStatus[];

export const longPollAssetStatus = async (timeout = 500, attempts = 240) =>
  longPoll(getAssetStatus, (s) => completedAssetStatuses.includes(s), timeout, attempts, "DENIED");
