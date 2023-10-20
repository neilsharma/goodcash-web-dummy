import type { AxiosInstance, AxiosResponse } from "axios";
import { CreateBankAccount, FailBankAccountCreation, OnboardingStepStatus } from "../types";
import { longPoll, urlPaths } from "../util";

interface GetKycPlaidTokenPayload {
  phone: string;
  email: string;
}

export class PlaidHttpService {
  constructor(private http: AxiosInstance) {}

  public getPlaidToken = async () => {
    const res = await this.http.post<any, AxiosResponse<string>>(urlPaths.PLAID_LINK_TOKEN);

    return res.data;
  };

  public getKycPlaidToken = async (payload: GetKycPlaidTokenPayload) => {
    const res = await this.http.post<any, AxiosResponse<string>>(
      urlPaths.KYC_PLAID_LINK_TOKEN,
      payload,
      {
        timeout: 60_000,
      }
    );

    return res.data;
  };

  public createBankAccount = async (payload: CreateBankAccount) => {
    const res = await this.http.post<any, AxiosResponse<string>>(
      urlPaths.BANK_ACCOUNT_CREATE,
      payload,
      {
        timeout: 0,
      }
    );

    return res.data;
  };

  public fetchBankAccountCreationStatus = async () => {
    const res = await this.http.get<
      any,
      AxiosResponse<{ status: OnboardingStepStatus; error?: string | null }>
    >(urlPaths.BANK_ACCOUNT_STATUS);

    return res.data;
  };

  public failBankAccountCreation = async (payload: FailBankAccountCreation) => {
    const res = await this.http.post<any, AxiosResponse<string>>(
      urlPaths.BANK_ACCOUNT_FAIL,
      payload
    );

    return res.data;
  };

  public longPollBankCreation = async (
    expectedStatuses: OnboardingStepStatus[] = ["COMPLETED", "FAILED"],
    fallback = { status: "FAILED" as OnboardingStepStatus, error: null },
    timeout = 1000
  ) =>
    longPoll(
      this.fetchBankAccountCreationStatus,
      ({ status }) => expectedStatuses.includes(status),
      timeout,
      110,
      fallback
    );
}

export default PlaidHttpService;
