import type { EntityConfig } from "../hooks/useEntity";

export const rechargeEntityConfig: EntityConfig = {
  name: "Recharge",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "string", description: "User ID who made the recharge" },
    userName: { type: "string", description: "User name" },
    userEmail: { type: "string", description: "User email" },
    operator: { type: "string", description: "Telecom operator name" },
    operatorCode: { type: "string", description: "Operator code" },
    mobileNumber: { type: "string", description: "Recharge mobile number" },
    amount: { type: "number", description: "Recharge amount" },
    transactionId: { type: "string", description: "Internal transaction ID" },
    operatorId: { type: "string", description: "Operator transaction ID" },
    apiResponse: { type: "string", description: "API response JSON" },
    status: {
      type: "string",
      enum: ["success", "pending", "failed"],
      default: "pending",
      description: "Recharge status",
    },
    paymentMethod: { type: "string", description: "Payment method used" },
    commissionAmount: { type: "number", description: "Commission earned" },
    serviceType: {
      type: "string",
      enum: ["mobile", "dth"],
      description: "Service type",
    },
    complaintStatus: {
      type: "string",
      enum: ["none", "raised", "resolved", "disputed"],
      default: "none",
      description: "Complaint status",
    },
    complaintId: { type: "string", description: "Complaint ID if raised" },
    complaintNote: { type: "string", description: "Complaint note" },
  },
  required: ["userId", "userName", "operator", "mobileNumber", "amount", "transactionId", "status"],
};
