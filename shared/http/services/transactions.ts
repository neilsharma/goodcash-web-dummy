import { AxiosInstance, AxiosResponse } from "axios";
import { urlPaths } from "../util";
import { ITransactions } from "../types";

export const defaultTransactionsTake = 15;
export class TransactionHttpService {
  constructor(private http: AxiosInstance) {}

  public listTransactions = async (skip = 0, take = defaultTransactionsTake) => {
    try {
      const q = new URLSearchParams();
      q.append("skip", skip.toString());
      q.append("take", take.toString());

      const response = await this.http.get<any, AxiosResponse<ITransactions>>(
        `${urlPaths.TRANSACTIONS_LIST}?${q}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

export default TransactionHttpService;
