import type { EntityConfig } from "../hooks/useEntity";

export const user2FAEntityConfig: EntityConfig = {
  name: "User2FA",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "string", description: "User ID (email)" },
    enabled: { type: "string", description: "2FA enabled status (true/false)" },
    secret: { type: "string", description: "TOTP secret key" },
    backupCodes: { type: "string", description: "JSON array of backup codes" },
    verifiedAt: { type: "string", description: "Timestamp when 2FA was verified" },
  },
  required: ["userId", "enabled"],
};
