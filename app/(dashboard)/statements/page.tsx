import { DownloadCloud } from "react-feather";
import config from "@/tailwind.config";
import { formatDate } from "../../../utils/utils";
import { IStatement } from "@/shared/http/types";
import appRouterServerSideHttpClient from "@/shared/http/clients/app-router/server-side";
import StatementsHttpService from "@/shared/http/services/statements";

const colors = config.theme.extend.colors;

// const { listStatements, getUriForStatementDownload } = new StatementsHttpService(
const { getUriForStatementDownload } = new StatementsHttpService(appRouterServerSideHttpClient);
const Statements = async () => {
  // const statements = await listStatements();
  const statement1: IStatement = {
    id: "statement123",
    name: "Monthly Statement - April 2023",
    date: "2023-04-30",
  };

  const statement2: IStatement = {
    id: "statement456",
    name: "Quarterly Statement - Q2 2023",
    date: "2023-06-30",
  };

  const statement3: IStatement = {
    id: "statement789",
    date: "2023-05-31",
  };
  const statements = [statement1, statement2, statement3];

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="font-kansasNewSemiBold text-primary text-2xl font-semibold text-center">
        Statements
      </h1>
      <div className=" bg-black/10 w-full h-[1px]" />
      <div className="overflow-scroll w-full h-[65vh] flex flex-col gap-4 items-center">
        {statements.map((statement) => {
          return (
            <div
              key={statement.id}
              className="flex w-full my-4 items-center justify-between flex-row"
            >
              <p className="p-2 bg-error text-white rounded-md">PDF</p>
              <div className="w-5/6">
                <h1 className=" font-sharpGroteskBook text-thinText text-sm">
                  {formatDate(statement.date, true)}
                </h1>
              </div>
              {/* <a href={getUriForStatementDownload(statement.id)}> */}
              <a href={"/getStatement"}>
                <DownloadCloud color={colors.primary} />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Statements;
