import type { EntityConfig } from "../hooks/useEntity";

export const busAPIProviderEntityConfig: EntityConfig = {
  name: "BusAPIProvider",
  orderBy: "created_at DESC",
  properties: {
    providerName: { type: "string", description: "API provider name" },
    providerCode: { type: "string", description: "Unique provider code" },
    apiEndpoint: { type: "string", description: "API endpoint URL" },
    apiKey: { type: "string", description: "API authentication key" },
    apiSecret: { type: "string", description: "API secret key" },
    isActive: { type: "string", description: "Active status (true/false)" },
    incomingCommission: { type: "number", description: "Commission received (%) from API provider" },
    outgoingCommission: { type: "number", description: "Commission paid (%) when sharing API" },
    margin: { type: "number", description: "Net margin (%) - incoming minus outgoing" },
    apiSharingEnabled: { type: "string", description: "Allow API sharing (true/false)" },
    maxDailyRequests: { type: "integer", description: "Maximum daily API requests" },
    currentDailyRequests: { type: "integer", description: "Current daily request count" },
    priority: { type: "integer", description: "Provider priority (1=highest)" },
    responseTime: { type: "number", description: "Average response time in ms" },
    successRate: { type: "number", description: "Success rate percentage" },
    description: { type: "string", description: "Provider description" },
  },
  required: ["providerName", "providerCode", "apiEndpoint", "incomingCommission", "outgoingCommission"],
};
