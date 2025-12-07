import type { EntityConfig } from "../hooks/useEntity";

export const subscriptionEntityConfig: EntityConfig = {
  name: "Subscription",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "integer", description: "User ID" },
    packageId: { type: "integer", description: "Package ID" },
    planName: { type: "string", description: "Subscription plan name" },
    planType: {
      type: "string",
      enum: ["monthly", "quarterly", "half-yearly", "yearly"],
      description: "Subscription period",
    },
    amount: { type: "number", description: "Subscription amount" },
    status: {
      type: "string",
      enum: ["active", "expired", "cancelled", "suspended"],
      default: "active",
      description: "Subscription status",
    },
    startDate: { type: "string", format: "date", description: "Start date" },
    endDate: { type: "string", format: "date", description: "End date" },
    nextBillingDate: { type: "string", format: "date", description: "Next billing date" },
    autoRenew: { type: "string", default: "true", description: "Auto renewal status" },
    features: { type: "string", description: "JSON array of features" },
  },
  required: ["userId", "planName", "planType", "amount", "startDate", "endDate"],
};
