import type { EntityConfig } from "../hooks/useEntity";

export const commissionEntityConfig: EntityConfig = {
  name: "Commission",
  orderBy: "created_at DESC",
  properties: {
    role: {
      type: "string",
      enum: ["api_user", "master_distributor", "distributor", "retailer"],
      description: "User role"
    },
    serviceType: {
      type: "string",
      enum: ["recharge", "dth", "electricity", "water", "gas", "broadband", "insurance", "loan", "all"],
      description: "Service type"
    },
    inCommission: { type: "number", default: "0", description: "Incoming commission percentage" },
    outCommission: { type: "number", default: "0", description: "Outgoing commission percentage" },
    minAmount: { type: "number", default: "0", description: "Minimum transaction amount" },
    maxAmount: { type: "number", default: "0", description: "Maximum transaction amount" },
    status: {
      type: "string",
      enum: ["active", "inactive"],
      default: "active",
      description: "Commission rule status"
    },
    packageId: { type: "integer", description: "Package ID if package-specific" },
    operatorName: { type: "string", description: "Specific operator if operator-specific" }
  },
  required: ["role", "serviceType", "inCommission", "outCommission"]
};
