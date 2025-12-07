import type { EntityConfig } from "../hooks/useEntity";

export const transactionEntityConfig: EntityConfig = {
  name: "Transaction",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "integer", description: "User ID" },
    type: {
      type: "string",
      enum: ["recharge", "dth", "electricity", "water", "gas", "broadband", "insurance", "loan", "wallet_credit", "wallet_debit", "commission_credit", "fund_transfer"],
      description: "Transaction type"
    },
    amount: { type: "number", description: "Transaction amount in INR" },
    status: {
      type: "string",
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
      description: "Transaction status"
    },
    operatorName: { type: "string", description: "Operator/service provider name" },
    accountNumber: { type: "string", description: "Account/mobile number" },
    apiId: { type: "integer", description: "API Config ID used" },
    apiResponse: { type: "string", description: "API response JSON" },
    orderId: { type: "string", description: "Order ID" },
    operatorRef: { type: "string", description: "Operator reference number" },
    commission: { type: "number", default: "0", description: "Commission earned" },
    parentCommission: { type: "string", description: "Parent commission breakdown JSON" },
    beforeBalance: { type: "number", description: "Balance before transaction" },
    afterBalance: { type: "number", description: "Balance after transaction" },
    remarks: { type: "string", description: "Transaction remarks" },
    invoiceUrl: { type: "string", description: "Invoice PDF URL" }
  },
  required: ["userId", "type", "amount", "status"]
};
