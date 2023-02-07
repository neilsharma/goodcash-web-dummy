import type { AxiosResponse } from "axios";
import http from "../client";
import { urlPaths } from "../util";

export const getPlaidToken = async () => {
  const res = await http.post<any, AxiosResponse<string>>(urlPaths.KYC_PLAID_LINK_TOKEN);

  return res.data;
};
