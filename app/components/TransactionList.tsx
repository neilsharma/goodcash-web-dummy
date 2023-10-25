"use client";

import { useCallback, useEffect, useState } from "react";
import { TransactionHttpService } from "../../shared/http/services/transactions";
import { ITransaction, ITransactions } from "../../shared/http/types";
import TransactionListItem from "./TransactionListItem";
import {
  groupTransactionsByDay,
  handleScroll,
  transactionListSectionHandler,
} from "../../utils/utils";
import appRouterClientSideHttpClient from "../../shared/http/clients/app-router/client-side";
import Loader from "../../components/Loader";

const { listTransactions } = new TransactionHttpService(appRouterClientSideHttpClient);
const TransactionList = () => {
  const perPage = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<ITransactions>([]);
  const [groupedTransactions, setGroupedTransactions] = useState<
    Record<string, Array<ITransaction>>
  >({});

  const getTransactions = useCallback(async () => {
    const transactionData = await listTransactions(transactions.length, perPage);
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
                <h2 className="text-gray-500 my-4">{transactionListSectionHandler(day)}</h2>
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
