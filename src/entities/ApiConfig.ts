import type { EntityConfig } from "../hooks/useEntity";

export const apiConfigEntityConfig: EntityConfig = {
  name: "ApiConfig",
  orderBy: "created_at DESC",
  properties: {
    name: { type: "string", description: "API provider name" },
    type: {
      type: "string",
      enum: ["recharge", "dth", "electricity", "water", "gas", "broadband", "insurance", "loan", "other"],
      description: "Service type"
    },
    endpoint: { type: "string", description: "API endpoint URL" },
    authKey: { type: "string", description: "API authentication key" },
    authType: {
      type: "string",
      enum: ["bearer", "api_key", "basic", "custom"],
      default: "bearer",
      description: "Authentication type"
    },
    priority: { type: "integer", default: "1", description: "API priority (1=highest)" },
    status: {
      type: "string",
      enum: ["active", "inactive", "maintenance"],
      default: "active",
      description: "API status"
    },
    commission: { type: "number", default: "0", description: "Platform commission percentage" },
    parameters: { type: "string", description: "API parameters JSON" },
    headers: { type: "string", description: "Custom headers JSON" },
    successCodes: { type: "string", description: "Success response codes JSON" },
    testMode: { type: "string", default: "false", description: "Test mode enabled" }
  },
  required: ["name", "type", "endpoint", "authKey"]
};
