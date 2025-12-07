import type { EntityConfig } from "../hooks/useEntity";

export const referralEntityConfig: EntityConfig = {
  name: "Referral",
  orderBy: "created_at DESC",
  properties: {
    referrerId: { type: "integer", description: "Referrer user ID" },
    referredId: { type: "integer", description: "Referred user ID" },
    referralCode: { type: "string", description: "Referral code used" },
    status: {
      type: "string",
      enum: ["pending", "active", "completed"],
      default: "pending",
      description: "Referral status"
    },
    reward: { type: "number", default: "0", description: "Referral reward amount" },
    rewardPaid: { type: "string", default: "false", description: "Reward payment status" },
    level: { type: "integer", default: "1", description: "Referral level (1=direct, 2=indirect)" },
    transactionCount: { type: "integer", default: "0", description: "Referred user transaction count" },
    totalBusiness: { type: "number", default: "0", description: "Total business generated" }
  },
  required: ["referrerId", "referredId", "referralCode"]
};
