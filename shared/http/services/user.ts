import type { Auth } from "firebase/auth";
import type { AxiosInstance, AxiosResponse } from "axios";
import { getComputedAuth } from "@/shared/context/global";
import { longPoll, urlPaths } from "../util";
import {
  AssetStatus,
  GCUser,
  IdentityBasics,
  KycTaxInfo,
  UserAddress,
  KYCAttempt,
  OnboardingStepStatus,
} from "../types";
import { RecursivePartial, SharedOnboardingState, UserOnboardingState } from "@/shared/types";

export class UserHttpService {
  constructor(private http: AxiosInstance) {}

  public createUser = async (auth: Auth | null, flowName?: string | string[]) => {
    if (!auth) throw new Error("not authenticated");

    const jwt = await getComputedAuth()?.currentUser?.getIdToken();

    if (!jwt) throw new Error("not authenticated");

    const payload: { jwt: string; flowName?: string | string[] } = { jwt };
    if (flowName) payload.flowName = flowName;

    const res = await this.http.post<any, AxiosResponse<GCUser>>(urlPaths.USER_ME_CREATE, payload);

    return res.data;
  };

  public getUser = async (token?: string) => {
    const res = await this.http.get<any, AxiosResponse<GCUser | null>>(urlPaths.USER_ME, {
      ...(token ? { headers: { "goodcash-authorization": token } } : {}),
    });

    return res.data;
  };

  public updateUserAddress = async (payload: UserAddress) => {
    const res = await this.http.post<any, AxiosResponse<UserAddress>>(
      urlPaths.KYC_ADDRESS,
      payload
    );

    return res.data;
  };

  public updateUserIdentityBasic = async (payload: IdentityBasics) => {
    const res = await this.http.post<any, AxiosResponse<IdentityBasics>>(
      urlPaths.KYC_IDENTITY_BASICS,
      payload
    );

    return res.data;
  };

  public updateTaxInfo = async (payload: KycTaxInfo) => {
    const res = await this.http.post<any, AxiosResponse<KycTaxInfo>>(
      urlPaths.KYC_TAX_INFO,
      payload
    );

    return res.data;
  };

  public fillKYCIdentity = async (payload: { sessionId: string }) => {
    const res = await this.http.post<any, AxiosResponse<"OK">>(urlPaths.KYC_IDENTITY, {
      source: "Plaid",
      data: payload,
    });

    return res.data;
  };

  public submitKyc = async () => {
    const res = await this.http.post<any, AxiosResponse<void>>(urlPaths.KYC_ATTEMPT_SUBMIT, null, {
      timeout: 40_000,
    });

    return res.data;
  };

  public fetchKycSubmissionStatus = async () => {
    const res = await this.http.get<any, AxiosResponse<OnboardingStepStatus>>(
      urlPaths.KYC_SUBMISSION_STATUS
    );

    return res.data;
  };

  public longPollKycSubmissionStatus = async (
    expectedStatuses: OnboardingStepStatus[] = ["COMPLETED", "FAILED"],
    fallback = "FAILED" as OnboardingStepStatus,
    timeout = 1000
  ) =>
    longPoll(
      this.fetchKycSubmissionStatus,
      (status) => expectedStatuses.includes(status),
      timeout,
      110,
      fallback
    );

  public getUserOnboardingVersion = async (token: string) => {
    const res = await this.http.get<
      any,
      AxiosResponse<RecursivePartial<UserOnboardingState> | null>
    >(urlPaths.USER_ONBOARDING_VERSION, {
      headers: { "goodcash-authorization": token },
    });

    return res.data;
  };

  public getUserOnboarding = async (token: string) => {
    const res = await this.http.get<
      any,
      AxiosResponse<RecursivePartial<SharedOnboardingState> | null>
    >(urlPaths.USER_ONBOARDING, {
      headers: { "goodcash-authorization": token },
    });

    return res.data;
  };

  public patchUserOnboarding = async (data: RecursivePartial<SharedOnboardingState>) => {
    const res = await this.http.patch(urlPaths.PATCH_USER_ONBOARDING, data);

    return res.data;
  };

  public completeUserOnboarding = async () => {
    const res = await this.http.post(urlPaths.USER_COMPLETE_ONBOARDING);

    return res.data;
  };

  public userOnboardingCompletionStatus = async () => {
    const res = await this.http.get(urlPaths.USER_ONBOARDING_STATUS);

    return res.data;
  };

  public getLatestKycAttempt = async () => {
    const res = await this.http.get<any, AxiosResponse<KYCAttempt>>(urlPaths.KYC_ATTEMPT);

    return res.data;
  };

  public getAssetStatus = async () => {
    const res = await this.http.get<any, AxiosResponse<AssetStatus>>(urlPaths.USER_ASSET_STATUS);

    return res.data;
  };
  public getBankLocStatus = async () => {
    const res = await this.http.get<any, AxiosResponse<OnboardingStepStatus>>(
      urlPaths.BANK_LOC_STATUS
    );

    return res.data;
  };

  private completedAssetStatuses = ["APPROVED", "DENIED"] as AssetStatus[];
  private completedOnboardingStatuses = ["COMPLETED", "FAILED"] as OnboardingStepStatus[];

  public longPollAssetStatus = async (timeout = 1000, attempts = 110) =>
    longPoll(
      this.getAssetStatus,
      (s) => this.completedAssetStatuses.includes(s),
      timeout,
      attempts,
      "DENIED"
    );

  public longPollOnboardingCompletionStatus = async (timeout = 1000, attempts = 110) =>
    longPoll(
      this.userOnboardingCompletionStatus,
      (s) => this.completedOnboardingStatuses.includes(s),
      timeout,
      attempts,
      "FAILED"
    );
}

export default UserHttpService;
