import type { EntityConfig } from "../hooks/useEntity";

export const b2bUserAccessEntityConfig: EntityConfig = {
  name: "B2BUserAccess",
  orderBy: "created_at DESC",
  properties: {
    organizationId: { type: "integer", description: "Organization ID" },
    userId: { type: "integer", description: "User ID" },
    role: { 
      type: "string",
      enum: ["admin", "finance_manager", "accountant", "viewer", "approver"],
      description: "User role in organization" 
    },
    permissions: { type: "string", description: "Permissions JSON array" },
    canViewInvoices: { type: "string", default: "true", description: "Can view invoices" },
    canCreateInvoices: { type: "string", default: "false", description: "Can create invoices" },
    canApproveInvoices: { type: "string", default: "false", description: "Can approve invoices" },
    canManagePayments: { type: "string", default: "false", description: "Can manage payments" },
    canViewReports: { type: "string", default: "true", description: "Can view reports" },
    canExportData: { type: "string", default: "false", description: "Can export data" },
    canManageUsers: { type: "string", default: "false", description: "Can manage users" },
    status: { 
      type: "string",
      enum: ["active", "inactive", "pending"],
      default: "active",
      description: "Access status" 
    },
    invitedBy: { type: "integer", description: "User ID who sent invitation" },
    invitedDate: { type: "string", format: "date", description: "Invitation date" },
    acceptedDate: { type: "string", format: "date", description: "Acceptance date" },
  },
  required: ["organizationId", "userId", "role"],
};
