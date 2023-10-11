import { AxiosResponse } from "axios";
import http from "../client";
import { longPoll, urlPaths } from "../util";
import { ELoanAgreementStatus, LoanAgreement, UserStateCoverageMap } from "../types";

export const getUserStateCoverageMap = async () => {
  const res = await http.get<any, AxiosResponse<UserStateCoverageMap>>(
    urlPaths.LOAN_AGREEMENTS_COVERAGE
  );

  return res.data;
};

export const getLoanAgreement = async () => {
  const res = await http.get<any, AxiosResponse<LoanAgreement>>(urlPaths.LOAN_AGREEMENTS);

  return res.data;
};

export const longPollLongAgreementStatus = async (
  expectedStatuses: ELoanAgreementStatus[],
  fallback = ELoanAgreementStatus.REJECTED,
  timeout = 1000
) =>
  longPoll(
    () => getLoanAgreement().then((r) => r.status),
    (status) => expectedStatuses.includes(status),
    timeout,
    110,
    fallback
  );

export const createLoanApplication = async () => {
  const res = await http.post(urlPaths.LOAN_AGREEMENTS_APPLICATIONS);

  return res.data;
};

export const approveApplication = async () => {
  const res = await http.post(urlPaths.LOAN_AGREEMENTS_APPLICATION_APPROVE);

  return res.data;
};

export const createLoanAgreement = async () => {
  const res = await http.post(urlPaths.LOAN_AGREEMENTS);

  return res.data;
};

export const getLoanAgreementUrl = () => getLoanAgreement().then((r) => r.documentUrl);

export const completeLoanAgreement = async () => {
  const res = await http.post(urlPaths.LOAN_AGREEMENTS_COMPLETE);

  return res.data;
};
