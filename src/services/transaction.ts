import API from "./api";

export const getTransactions = () => API.get("/transactions");
export const addTransaction = (data: any) =>
  API.post("/transactions", data);
export const deleteTransaction = (id: string) =>
  API.delete(`/transactions/${id}`);