import { AxiosInstance, AxiosResponse } from "axios";
import { urlPaths } from "../util";
import { FundingCard } from "../types";

type CreateFundingCardResponse = FundingCard;

interface VerifyFundingCardPayload {
  paymentMethodId: string;
  paymentIntentId: string;
  paymentIntentClientSecret: string;
}

export class DebitFundingCardHttpService {
  constructor(private http: AxiosInstance) {}
  public createFundingCard = async (payload: { paymentMethodId: string }) => {
    const res = await this.http.post<any, AxiosResponse<CreateFundingCardResponse>>(
      `${urlPaths.CREATE_FUNDING_CARD}`,
      { paymentMethodId: payload.paymentMethodId },
      {
        timeout: 50_000,
      }
    );

    return res.data;
  };

  public verifyFundingCard = async (payload: VerifyFundingCardPayload) => {
    const res = await this.http.post<any, AxiosResponse<void>>(
      `${urlPaths.VERIFY_FUNDING_CARD}`,
      payload,
      {
        timeout: 50_000,
      }
    );

    return res.data;
  };
}

export default DebitFundingCardHttpService;
