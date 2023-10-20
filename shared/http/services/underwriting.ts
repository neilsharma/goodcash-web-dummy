import type { AxiosInstance, AxiosResponse } from "axios";

import { UnderwritingResponse } from "../types";
import { urlPaths } from "../util";

export class UnderwritingHttpService {
  constructor(private http: AxiosInstance) {}

  public underwrite = async () => {
    const res = await this.http.post<any, AxiosResponse<UnderwritingResponse>>(
      urlPaths.UNDERWRITING
    );

    return res.data;
  };

  public failUnderwriting = async () => {
    const res = await this.http.post<any, AxiosResponse<UnderwritingResponse>>(
      urlPaths.UNDERWRITING_FAIL
    );

    return res.data;
  };
}

export default UnderwritingHttpService;
