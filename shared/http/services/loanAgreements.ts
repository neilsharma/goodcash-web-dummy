import { AxiosInstance, AxiosResponse } from "axios";
import { longPoll, urlPaths } from "../util";
import { ELoanAgreementStatus, LoanAgreement, UserStateCoverageMap } from "../types";

export class LoanAgreementsHttpService {
  constructor(private http: AxiosInstance) {}

  public getUserStateCoverageMap = async () => {
    const res = await this.http.get<any, AxiosResponse<UserStateCoverageMap>>(
      urlPaths.LOAN_AGREEMENTS_COVERAGE
    );

    return res.data;
  };

  public getLoanAgreement = async () => {
    const res = await this.http.get<any, AxiosResponse<LoanAgreement>>(urlPaths.LOAN_AGREEMENTS);

    return res.data;
  };

  public longPollLongAgreementStatus = async (
    expectedStatuses: ELoanAgreementStatus[],
    fallback = ELoanAgreementStatus.REJECTED,
    timeout = 1000
  ) =>
    longPoll(
      () => this.getLoanAgreement().then((r) => r.status),
      (status) => expectedStatuses.includes(status),
      timeout,
      110,
      fallback
    );

  public createLoanApplication = async () => {
    const res = await this.http.post(urlPaths.LOAN_AGREEMENTS_APPLICATIONS);

    return res.data;
  };

  public approveApplication = async () => {
    const res = await this.http.post(urlPaths.LOAN_AGREEMENTS_APPLICATION_APPROVE);

    return res.data;
  };

  public createLoanAgreement = async () => {
    const res = await this.http.post(urlPaths.LOAN_AGREEMENTS);

    return res.data;
  };

  public getLoanAgreementUrl = () => this.getLoanAgreement().then((r) => r.documentUrl);

  public completeLoanAgreement = async () => {
    const res = await this.http.post(urlPaths.LOAN_AGREEMENTS_COMPLETE);

    return res.data;
  };
}

export default LoanAgreementsHttpService;
