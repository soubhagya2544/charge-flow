import type { EntityConfig } from "../hooks/useEntity";

export const notificationEntityConfig: EntityConfig = {
  name: "Notification",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "integer", description: "User ID (0 for all users)" },
    title: { type: "string", description: "Notification title" },
    message: { type: "string", description: "Notification message" },
    type: {
      type: "string",
      enum: ["info", "success", "warning", "error", "offer"],
      default: "info",
      description: "Notification type"
    },
    read: { type: "string", default: "false", description: "Read status" },
    actionUrl: { type: "string", description: "Action URL if clickable" },
    imageUrl: { type: "string", description: "Notification image URL" },
    expiryDate: { type: "string", format: "date", description: "Expiry date for offers" }
  },
  required: ["title", "message"]
};
