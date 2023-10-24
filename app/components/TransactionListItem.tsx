import { ITransaction } from "../../shared/http/types";

interface IListItemProps {
  transaction: ITransaction;
}

const TransactionListItem = ({ transaction }: IListItemProps) => {
  return (
    <li key={transaction.id} className="py-2 w-full flex flex-row justify-between">
      <div>
        <div className="text-lg font-sharpGroteskMedium">{transaction.description}</div>
        <div
          className={`${transaction.state === "DECLINED" ? "text-error" : "text-gray-500"} text-sm`}
        >
          {`${new Date(transaction.createdAt).toLocaleTimeString("en-US", {
            timeStyle: "short",
            hour12: true,
          })}`}
          {transaction.state === "DECLINED" && " - Failed"}
        </div>
      </div>
      <div className="flex flex-row relative h-max">
        <p>${transaction.amount.toString().split(".")[0]}</p>
        <p className="text-sm self-end">.{transaction.amount.toString().split(".")[1]}</p>
      </div>
    </li>
  );
};

export default TransactionListItem;
