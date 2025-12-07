import type { EntityConfig } from "../hooks/useEntity";

export const fundRequestEntityConfig: EntityConfig = {
  name: "FundRequest",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "string", description: "User ID" },
    userEmail: { type: "string", description: "User email" },
    userName: { type: "string", description: "User name" },
    userRole: { type: "string", description: "User role" },
    amount: { type: "number", description: "Requested amount" },
    paymentMethod: {
      type: "string",
      enum: ["NEFT", "RTGS", "IMPS", "UPI", "Bank Transfer"],
      description: "Payment method used",
    },
    transactionId: { type: "string", description: "Bank transaction ID" },
    bankName: { type: "string", description: "Bank name" },
    accountNumber: { type: "string", description: "Last 4 digits of account" },
    paymentProof: { type: "string", description: "Payment proof URL (optional)" },
    status: {
      type: "string",
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      description: "Request status",
    },
    adminNotes: { type: "string", description: "Admin verification notes" },
    approvedBy: { type: "string", description: "Admin who approved/rejected" },
    approvedAt: { type: "string", description: "Approval/rejection timestamp" },
  },
  required: ["userId", "userEmail", "userName", "userRole", "amount", "paymentMethod", "transactionId"],
};
