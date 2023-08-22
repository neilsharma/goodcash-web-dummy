import http from "../client";
import { urlPaths } from "../util";

export const createFundingCard = async (payload: { paymentMethodId: string }) => {
  const res = await http.post(
    `${urlPaths.CREATE_FUNDING_CARD}`,
    { paymentMethodId: payload.paymentMethodId },
    {
      timeout: 50_000,
    }
  );

  return res.data;
};
