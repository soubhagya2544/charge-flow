import type { EntityConfig } from "../hooks/useEntity";

export const b2bInvoiceEntityConfig: EntityConfig = {
  name: "B2BInvoice",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "integer", description: "User ID" },
    organizationName: { type: "string", description: "Organization name" },
    invoiceNumber: { type: "string", description: "Invoice number" },
    invoiceDate: { type: "string", format: "date", description: "Invoice date" },
    dueDate: { type: "string", format: "date", description: "Payment due date" },
    paymentTerms: { 
      type: "string", 
      enum: ["net15", "net30", "net45", "net60", "due_on_receipt", "custom"],
      description: "Payment terms" 
    },
    customPaymentTerms: { type: "string", description: "Custom payment terms description" },
    subtotal: { type: "number", description: "Subtotal amount" },
    taxAmount: { type: "number", description: "Tax amount" },
    discountAmount: { type: "number", description: "Discount amount" },
    discountType: { 
      type: "string", 
      enum: ["volume", "early_payment", "custom", "none"],
      description: "Type of discount" 
    },
    totalAmount: { type: "number", description: "Total invoice amount" },
    status: { 
      type: "string", 
      enum: ["draft", "sent", "paid", "partial", "overdue", "cancelled"],
      default: "draft",
      description: "Invoice status" 
    },
    currency: { type: "string", default: "INR", description: "Currency" },
    billingPeriodStart: { type: "string", format: "date", description: "Billing period start" },
    billingPeriodEnd: { type: "string", format: "date", description: "Billing period end" },
    customFields: { type: "string", description: "Custom fields JSON" },
    lineItems: { type: "string", description: "Line items JSON" },
    notes: { type: "string", description: "Invoice notes" },
    internalNotes: { type: "string", description: "Internal notes (not visible to client)" },
    paidAmount: { type: "number", default: 0, description: "Amount paid" },
    paidDate: { type: "string", format: "date", description: "Payment date" },
    gstNumber: { type: "string", description: "GST number" },
    panNumber: { type: "string", description: "PAN number" },
    billingAddress: { type: "string", description: "Billing address JSON" },
    shippingAddress: { type: "string", description: "Shipping address JSON" },
  },
  required: ["userId", "organizationName", "invoiceNumber", "invoiceDate", "dueDate", "totalAmount"],
};
