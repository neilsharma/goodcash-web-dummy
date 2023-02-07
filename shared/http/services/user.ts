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
