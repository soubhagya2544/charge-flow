import type { EntityConfig } from "../hooks/useEntity";

export const walletTransactionEntityConfig: EntityConfig = {
  name: "WalletTransaction",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "string", description: "User ID" },
    userEmail: { type: "string", description: "User email" },
    userName: { type: "string", description: "User name" },
    transactionId: { type: "string", description: "Unique transaction ID" },
    type: {
      type: "string",
      enum: ["credit", "debit"],
      description: "Transaction type",
    },
    category: {
      type: "string",
      enum: ["fund_request", "commission", "recharge", "bus_booking", "refund", "adjustment"],
      description: "Transaction category",
    },
    amount: { type: "number", description: "Transaction amount" },
    balanceBefore: { type: "number", description: "Balance before transaction" },
    balanceAfter: { type: "number", description: "Balance after transaction" },
    description: { type: "string", description: "Transaction description" },
    serviceType: { type: "string", description: "Service type (mobile, dth, bus)" },
    operatorName: { type: "string", description: "Operator name" },
    referenceId: { type: "string", description: "Reference ID (fund request, booking)" },
    paymentMethod: { type: "string", description: "Payment method used" },
    status: {
      type: "string",
      enum: ["success", "pending", "failed", "reversed"],
      default: "success",
      description: "Transaction status",
    },
  },
  required: ["userId", "userEmail", "userName", "transactionId", "type", "category", "amount", "balanceAfter"],
};
