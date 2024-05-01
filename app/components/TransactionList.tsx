"use client";

import { useCallback, useEffect, useState } from "react";
import { Currency, ITransaction, ITransactions } from "../../shared/http/types";
import TransactionListItem from "./TransactionListItem";
import { groupTransactionsByDay, handleScroll, formatDate } from "../../utils/utils";
import Loader from "../../components/Loader";

// const { listTransactions } = new TransactionHttpService(appRouterClientSideHttpClient);
const TransactionList = () => {
  // const perPage = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<ITransactions>([]);
  const [groupedTransactions, setGroupedTransactions] = useState<
    Record<string, Array<ITransaction>>
  >({});

  const getTransactions = useCallback(async () => {
    // const transactionData = await listTransactions(transactions.length, perPage);

    const dummyTransaction1: ITransaction = {
      id: "transaction1",
      type: "CARD",
      entityId: "entity123",
      state: "completed",
      amount: 100.5,
      currentAmount: 100.5,
      settledAmount: 100.5,
      currency: Currency.USD,
      createdAt: "2023-04-01T00:00:00Z",
      description: "Purchase from Online Store",
      gcUserId: "user123",
    };

    const dummyTransaction2: ITransaction = {
      id: "transaction2",
      type: "REFUND",
      entityId: "entity456",
      state: "pending",
      amount: "200.00",
      currentAmount: "200.00",
      settledAmount: null,
      currency: Currency.USD,
      createdAt: new Date("2023-04-02T00:00:00Z"),
      description: "Refund for Order #123",
      gcUserId: "user456",
    };

    const dummyTransaction3: ITransaction = {
      id: "transaction3",
      type: "SUBSCRIPTION",
      entityId: "entity789",
      state: "completed",
      amount: 15.99,
      currentAmount: 15.99,
      settledAmount: 15.99,
      currency: Currency.USD,
      createdAt: "2023-04-03T00:00:00Z",
      description: "Monthly Subscription Fee",
      gcUserId: "user789",
    };

    const transactionData = [dummyTransaction1, dummyTransaction2, dummyTransaction3];
    setTransactions((prev) => [...prev, ...transactionData]);
  }, [transactions]);

  useEffect(() => {
    setIsLoading(true);
    getTransactions().finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transactionsSectionHandler = useCallback(() => {
    const groupedTransactions = groupTransactionsByDay(transactions);
    setGroupedTransactions(groupedTransactions);
  }, [transactions]);

  useEffect(() => {
    transactionsSectionHandler();
  }, [transactionsSectionHandler, transactions]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <h1 className="text-2xl font-kansasNewBold mb-2">Purchases</h1>
      <div
        className="h-[60vh] overflow-scroll w-full overflow-y-scroll no-scrollbar"
        onScroll={async (e) => {
          const isAtEnd = await handleScroll(e);
          if (isAtEnd) getTransactions();
        }}
      >
        {Object.keys(groupedTransactions).length === 0 ? (
          <p className="text-center text-gray-400">No transactions yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {Object.keys(groupedTransactions).map((day) => (
              <div key={day}>
                <h2 className="text-gray-500 my-4">{formatDate(day)}</h2>
                {groupedTransactions[day].map((transaction) => (
                  <TransactionListItem key={transaction.id} transaction={transaction} />
                ))}
              </div>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default TransactionList;
