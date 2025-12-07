import type { EntityConfig } from "../hooks/useEntity";

export const telecomOperatorEntityConfig: EntityConfig = {
  name: "TelecomOperator",
  orderBy: "created_at DESC",
  properties: {
    operatorName: { type: "string", description: "Operator name (Airtel, Jio, Vodafone, BSNL)" },
    operatorType: { 
      type: "string", 
      enum: ["mobile", "dth"],
      description: "Type of operator" 
    },
    operatorCode: { type: "string", description: "Unique operator code" },
    logo: { type: "string", description: "Operator logo URL" },
    isActive: { type: "string", description: "Active status (true/false)" },
    incomingCommission: { type: "number", description: "Commission received (%) when customers use this operator" },
    outgoingCommission: { type: "number", description: "Commission paid (%) to retailers/agents" },
    margin: { type: "number", description: "Net margin (%) - incoming minus outgoing" },
    minRechargeAmount: { type: "number", description: "Minimum recharge amount" },
    maxRechargeAmount: { type: "number", description: "Maximum recharge amount" },
    description: { type: "string", description: "Operator description" },
  },
  required: ["operatorName", "operatorType", "operatorCode", "incomingCommission", "outgoingCommission"],
};
