import type { EntityConfig } from "../hooks/useEntity";

export const apiKeyEntityConfig: EntityConfig = {
  name: "APIKey",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "integer", description: "User ID who owns this API key" },
    keyName: { type: "string", description: "Friendly name for the API key" },
    apiKey: { type: "string", description: "The actual API key value" },
    status: {
      type: "string",
      enum: ["active", "inactive", "revoked"],
      default: "active",
      description: "Current status of the API key",
    },
    ipWhitelist: { type: "string", description: "Comma-separated list of allowed IPs" },
    rateLimit: { type: "integer", default: "1000", description: "Requests per hour limit" },
    expiryDate: { type: "string", format: "date", description: "Expiry date for the key" },
    permissions: { type: "string", description: "Comma-separated permissions" },
  },
  required: ["userId", "keyName", "apiKey"],
};
