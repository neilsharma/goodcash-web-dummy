import { AxiosResponse } from "axios";
import http from "../client";
import { urlPaths } from "../util";
import { FundingCard, FundingCardState } from "../types";

type CreateFundingCardResponse = FundingCard;

export const createFundingCard = async (payload: { paymentMethodId: string }) => {
  const res = await http.post<any, AxiosResponse<CreateFundingCardResponse>>(
    `${urlPaths.CREATE_FUNDING_CARD}`,
    { paymentMethodId: payload.paymentMethodId },
    {
      timeout: 50_000,
    }
  );

  return res.data;
};

interface VerifyFundingCardPayload {
  paymentMethodId: string;
  setupIntentId: string;
  setupIntentClientSecret: string;
}

export const verifyFundingCard = async (payload: VerifyFundingCardPayload) => {
  const res = await http.post<any, AxiosResponse<void>>(
    `${urlPaths.VERIFY_FUNDING_CARD}`,
    payload,
    {
      timeout: 50_000,
    }
  );

  return res.data;
};
