import TransactionList from "../../components/TransactionList";

export default async function Transactions() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="font-kansasNewSemiBold text-primary text-4xl font-semibold text-center">
        Transactions
      </h1>
      <TransactionList />
    </div>
  );
}
