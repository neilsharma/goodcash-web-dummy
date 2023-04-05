import type { AxiosResponse } from "axios";
import http from "../client";
import { UnderwritingResponse } from "../types";
import { urlPaths } from "../util";

export const underwrite = async () => {
  const res = await http.post<any, AxiosResponse<UnderwritingResponse>>(urlPaths.UNDERWRITING);

  return res.data;
};

export const failUnderwriting = async () => {
  const res = await http.post<any, AxiosResponse<UnderwritingResponse>>(urlPaths.UNDERWRITING_FAIL);

  return res.data;
};
