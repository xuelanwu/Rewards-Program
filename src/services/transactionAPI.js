import { transactionsDemo } from "../constants/transactionDemo";

export const fetchAllTransactions = () => {
  return new Promise((resolve) => resolve(transactionsDemo));
};
