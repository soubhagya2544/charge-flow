import type { EntityConfig } from "../hooks/useEntity";

export const paymentMethodEntityConfig: EntityConfig = {
  name: "PaymentMethod",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "integer", description: "User ID" },
    methodType: {
      type: "string",
      enum: ["card", "upi", "netbanking", "wallet"],
      description: "Payment method type",
    },
    isDefault: { type: "string", default: "false", description: "Default payment method" },
    // Card details
    cardLast4: { type: "string", description: "Last 4 digits of card" },
    cardBrand: { type: "string", description: "Card brand (Visa, Mastercard, etc.)" },
    cardExpiry: { type: "string", description: "Card expiry (MM/YY)" },
    cardholderName: { type: "string", description: "Cardholder name" },
    // UPI details
    upiId: { type: "string", description: "UPI ID" },
    // Bank details
    bankName: { type: "string", description: "Bank name" },
    accountLast4: { type: "string", description: "Last 4 digits of account" },
    // Wallet details
    walletProvider: { type: "string", description: "Wallet provider (Paytm, PhonePe, etc.)" },
    walletNumber: { type: "string", description: "Wallet mobile number" },
    // Common
    nickname: { type: "string", description: "Custom name for payment method" },
    status: {
      type: "string",
      enum: ["active", "expired", "disabled"],
      default: "active",
      description: "Payment method status",
    },
  },
  required: ["userId", "methodType"],
};
