import type { EntityConfig } from "../hooks/useEntity";

export const rechargePlanEntityConfig: EntityConfig = {
  name: "RechargePlan",
  orderBy: "operator ASC, amount ASC",
  properties: {
    operator: {
      type: "string",
      description: "Telecom operator name (Jio, Airtel, Vi, BSNL)",
    },
    amount: {
      type: "number",
      description: "Plan amount in INR",
    },
    validity: {
      type: "string",
      description: "Plan validity (e.g., '28 days', '84 days', '365 days')",
    },
    data: {
      type: "string",
      description: "Data benefits (e.g., '2GB/day', 'Unlimited')",
    },
    voice: {
      type: "string",
      description: "Voice calling benefits (e.g., 'Unlimited', '300 min/day')",
    },
    sms: {
      type: "string",
      description: "SMS benefits (e.g., '100 SMS/day', 'Unlimited')",
    },
    type: {
      type: "string",
      enum: ["Prepaid", "Postpaid", "Data", "Roaming", "Special", "Top-up"],
      description: "Plan type/category",
    },
    benefits: {
      type: "string",
      description: "Additional benefits (JSON string for multiple items)",
    },
    description: {
      type: "string",
      description: "Plan description and details",
    },
    isActive: {
      type: "string",
      default: "true",
      description: "Whether plan is currently active",
    },
    commission: {
      type: "number",
      description: "Commission percentage for this plan",
      default: 2,
    },
  },
  required: ["operator", "amount", "validity", "type"],
};
