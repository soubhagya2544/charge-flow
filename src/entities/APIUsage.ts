import type { EntityConfig } from "../hooks/useEntity";

export const apiUsageEntityConfig: EntityConfig = {
  name: "APIUsage",
  orderBy: "created_at DESC",
  properties: {
    apiKeyId: { type: "integer", description: "API Key ID" },
    endpoint: { type: "string", description: "API endpoint path" },
    requestCount: { type: "integer", default: "0", description: "Total number of requests" },
    successCount: { type: "integer", default: "0", description: "Number of successful requests" },
    failureCount: { type: "integer", default: "0", description: "Number of failed requests" },
    avgResponseTime: { type: "number", default: "0", description: "Average response time in milliseconds" },
    lastUsed: { type: "string", format: "date", description: "Last time this endpoint was used" },
  },
  required: ["apiKeyId", "endpoint"],
};
