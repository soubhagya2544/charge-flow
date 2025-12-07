import type { EntityConfig } from "../hooks/useEntity";

export const walletEntityConfig: EntityConfig = {
  name: "Wallet",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "string", description: "User ID" },
    userEmail: { type: "string", description: "User email" },
    userName: { type: "string", description: "User name" },
    userRole: { type: "string", description: "User role" },
    balance: { type: "number", description: "Current wallet balance" },
    totalFunded: { type: "number", description: "Total amount funded" },
    totalCommission: { type: "number", description: "Total commission received" },
    totalSpent: { type: "number", description: "Total amount spent" },
    lowBalanceThreshold: { type: "number", default: "100", description: "Low balance alert threshold" },
    status: {
      type: "string",
      enum: ["active", "suspended", "frozen"],
      default: "active",
      description: "Wallet status",
    },
  },
  required: ["userId", "userEmail", "userName", "userRole", "balance"],
};
