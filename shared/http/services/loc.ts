import { kardTermsVersion } from "@/shared/config";
import { urlPaths } from "../util";
import { AxiosInstance, AxiosResponse } from "axios";
import { Balance, LocCard } from "../types";

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

  public getCards = async () => {
    const res = await this.http.get<any, AxiosResponse<LocCard[]>>(urlPaths.CARD_URL);

    return res.data;
  };

  public getCardLink = async (payload: { cardId: string }) => {
    const res = await this.http.get<any, AxiosResponse<string>>(
      `${urlPaths.CARD_URL}/${payload.cardId}/card_ui_link?css=web`
    );

    return res.data;
  };

  public freezeAllCards = async (payload: { locId: string }) => {
    const res = await this.http.post(urlPaths.FREEZE_CARD.replace(":locId", payload.locId));

    return res.data;
  };

  public unfreezeAllCards = async (payload: { locId: string }) => {
    const res = await this.http.post(urlPaths.UNFREEZE_CARD.replace(":locId", payload.locId));

    return res.data;
  };

  public getLocBalance = async (payload: { locId: string }) => {
    const res = await this.http.get<any, AxiosResponse<Balance>>(
      urlPaths.LOC_BALANCE.replace(":line_of_credit_id", payload.locId)
    );

    return res.data;
  };
}

export default LOCHttpService;
