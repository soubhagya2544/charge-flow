import type { EntityConfig } from "../hooks/useEntity";

export const fundOrderEntityConfig: EntityConfig = {
  name: "FundOrder",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "integer", description: "User ID" },
    amount: { type: "number", description: "Requested amount in INR" },
    paymentMode: {
      type: "string",
      enum: ["bank_transfer", "upi", "cash_deposit", "gateway"],
      description: "Payment mode"
    },
    status: {
      type: "string",
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      description: "Fund order status"
    },
    bankName: { type: "string", description: "Bank name" },
    accountNumber: { type: "string", description: "Bank account number" },
    transactionRef: { type: "string", description: "Transaction reference/UTR number" },
    receiptUrl: { type: "string", description: "Payment receipt URL" },
    remarks: { type: "string", description: "User remarks" },
    adminRemarks: { type: "string", description: "Admin remarks" },
    approvedBy: { type: "integer", description: "Admin user ID who approved" },
    approvedAt: { type: "string", format: "date", description: "Approval timestamp" }
  },
  required: ["userId", "amount", "paymentMode"]
};
