import { kardTermsVersion } from "@/shared/config";
import http from "../client";
import { urlPaths } from "../util";

export const submitLineOfCredit = async (payload: { locId: string }) => {
  const res = await http.post(`${urlPaths.LOC}/${payload.locId}/submit_application`, {
    kard_terms_version: kardTermsVersion,
  });

  return res.data;
};

export const activateLineOfCredit = async (payload: { locId: string }) => {
  const res = await http.post(`${urlPaths.LOC}/${payload.locId}/activate`);

  return res.data;
};
