import type { EntityConfig } from "../hooks/useEntity";

export const invoiceEntityConfig: EntityConfig = {
  name: "Invoice",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "integer", description: "User ID" },
    invoiceNumber: { type: "string", description: "Unique invoice number" },
    invoiceType: {
      type: "string",
      enum: ["subscription", "transaction", "commission", "refund"],
      description: "Type of invoice",
    },
    amount: { type: "number", description: "Invoice amount" },
    tax: { type: "number", description: "Tax amount" },
    totalAmount: { type: "number", description: "Total amount including tax" },
    status: {
      type: "string",
      enum: ["paid", "pending", "overdue", "cancelled"],
      default: "pending",
      description: "Invoice status",
    },
    dueDate: { type: "string", format: "date", description: "Payment due date" },
    paidDate: { type: "string", format: "date", description: "Payment date" },
    description: { type: "string", description: "Invoice description" },
    billingPeriod: { type: "string", description: "Billing period (e.g., Jan 2024)" },
    paymentMethod: { type: "string", description: "Payment method used" },
    transactionIds: { type: "string", description: "Related transaction IDs (JSON array)" },
  },
  required: ["userId", "invoiceNumber", "invoiceType", "amount", "totalAmount"],
};
