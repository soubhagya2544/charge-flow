import type { EntityConfig } from "../hooks/useEntity";

export const complaintEntityConfig: EntityConfig = {
  name: "Complaint",
  orderBy: "created_at DESC",
  properties: {
    complaintId: { type: "string", description: "Unique complaint ID" },
    userId: { type: "string", description: "User ID who raised complaint" },
    userName: { type: "string", description: "User name" },
    userEmail: { type: "string", description: "User email" },
    transactionType: {
      type: "string",
      enum: ["recharge", "bus_booking"],
      description: "Transaction type",
    },
    transactionId: { type: "string", description: "Related transaction ID" },
    complaintType: {
      type: "string",
      enum: ["failed_transaction", "wrong_recharge", "booking_issue", "refund_request", "other"],
      description: "Type of complaint",
    },
    description: { type: "string", description: "Complaint description" },
    amount: { type: "number", description: "Transaction amount" },
    status: {
      type: "string",
      enum: ["open", "in_progress", "resolved", "disputed", "closed"],
      default: "open",
      description: "Complaint status",
    },
    priority: {
      type: "string",
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      description: "Priority level",
    },
    adminResponse: { type: "string", description: "Admin response" },
    resolvedBy: { type: "string", description: "Admin who resolved" },
    resolvedAt: { type: "string", format: "date", description: "Resolution date" },
    attachments: { type: "string", description: "Attachment URLs (comma-separated)" },
  },
  required: ["complaintId", "userId", "userName", "transactionType", "transactionId", "complaintType", "description"],
};
