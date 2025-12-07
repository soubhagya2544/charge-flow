import type { EntityConfig } from "../hooks/useEntity";

export const packageEntityConfig: EntityConfig = {
  name: "Package",
  orderBy: "created_at DESC",
  properties: {
    name: { type: "string", description: "Package name" },
    description: { type: "string", description: "Package description" },
    price: { type: "number", description: "Package price in INR" },
    validityDays: { type: "integer", default: "365", description: "Validity in days" },
    features: { type: "string", description: "Package features JSON array" },
    commissionRates: { type: "string", description: "Commission rates JSON" },
    apiAccess: { type: "string", description: "API access permissions JSON" },
    transactionLimit: { type: "integer", default: "0", description: "Daily transaction limit (0=unlimited)" },
    status: {
      type: "string",
      enum: ["active", "inactive"],
      default: "active",
      description: "Package status"
    },
    popular: { type: "string", default: "false", description: "Popular package badge" }
  },
  required: ["name", "price", "validityDays"]
};
