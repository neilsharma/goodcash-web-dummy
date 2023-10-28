import { AxiosInstance, AxiosResponse } from "axios";
import { urlPaths } from "../util";
import { IStatements } from "../types";

export class StatementsHttpService {
  constructor(private http: AxiosInstance) {}

  public listStatements = async () => {
    try {
      const response = await this.http.get<any, AxiosResponse<IStatements>>(
        `${urlPaths.STATEMENTS}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public getUriForStatementDownload = (statementId: string) => {
    return new URL(urlPaths.STATEMENT.replace(":id", statementId), this.http.getUri()).toString();
  };
}

export default StatementsHttpService;
