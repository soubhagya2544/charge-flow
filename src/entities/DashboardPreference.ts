import type { EntityConfig } from "../hooks/useEntity";

export const dashboardPreferenceEntityConfig: EntityConfig = {
  name: "DashboardPreference",
  orderBy: "updated_at DESC",
  properties: {
    userId: { type: "string", description: "User ID" },
    userRole: { 
      type: "string", 
      enum: ["admin", "api_user", "retailer", "b2b_user"],
      description: "User role type" 
    },
    widgets: { 
      type: "string", 
      description: "JSON array of widget configurations with id, type, position, size, settings" 
    },
    layout: {
      type: "string",
      enum: ["compact", "comfortable", "spacious"],
      default: "comfortable",
      description: "Dashboard layout density"
    },
    theme: {
      type: "string",
      enum: ["light", "dark", "auto"],
      default: "light",
      description: "Dashboard theme preference"
    },
  },
  required: ["userId", "userRole", "widgets"],
};
