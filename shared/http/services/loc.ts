import { kardTermsVersion } from "@/shared/config";
import { urlPaths } from "../util";
import { AxiosInstance } from "axios";

export class LOCHttpService {
  constructor(private http: AxiosInstance) {}

  public submitLineOfCredit = async (payload: { locId: string }) => {
    const res = await this.http.post(`${urlPaths.LOC}/${payload.locId}/submit_application`, {
      kard_terms_version: kardTermsVersion,
    });

    return res.data;
  };

  public activateLineOfCredit = async (payload: { locId: string }) => {
    const res = await this.http.post(`${urlPaths.LOC}/${payload.locId}/activate`, null, {
      timeout: 50_000,
    });

    return res.data;
  };
}

export default LOCHttpService;
