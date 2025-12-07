type WalletUpdate = {
  balance: number;
  totalFunded?: number;
  totalCommission?: number;
  totalSpent?: number;
};

type TransactionData = {
  userId: string;
  userEmail: string;
  userName: string;
  type: "credit" | "debit";
  category: "fund_request" | "commission" | "recharge" | "bus_booking" | "refund" | "adjustment";
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  serviceType?: string;
  operatorName?: string;
  referenceId?: string;
  paymentMethod?: string;
};

export const generateTransactionId = (): string => {
  return `TXN${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};

export const deductFromWallet = async (
  walletId: number,
  currentBalance: number,
  amount: number,
  updateWallet: (id: number, data: WalletUpdate) => Promise<void>,
  createTransaction: (data: TransactionData) => Promise<void>,
  transactionData: Omit<TransactionData, "type" | "balanceBefore" | "balanceAfter">
): Promise<boolean> => {
  if (currentBalance < amount) {
    return false;
  }

  const newBalance = currentBalance - amount;
  await updateWallet(walletId, { balance: newBalance });

  await createTransaction({
    ...transactionData,
    type: "debit",
    balanceBefore: currentBalance,
    balanceAfter: newBalance,
  });

  return true;
};

export const addToWallet = async (
  walletId: number,
  currentBalance: number,
  amount: number,
  updateWallet: (id: number, data: WalletUpdate) => Promise<void>,
  createTransaction: (data: TransactionData) => Promise<void>,
  transactionData: Omit<TransactionData, "type" | "balanceBefore" | "balanceAfter">
): Promise<void> => {
  const newBalance = currentBalance + amount;
  await updateWallet(walletId, { balance: newBalance });

  await createTransaction({
    ...transactionData,
    type: "credit",
    balanceBefore: currentBalance,
    balanceAfter: newBalance,
  });
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

export const checkLowBalance = (balance: number, threshold: number): boolean => {
  return balance < threshold;
};
