import type { EntityConfig } from "../hooks/useEntity";

export const b2bOrganizationEntityConfig: EntityConfig = {
  name: "B2BOrganization",
  orderBy: "created_at DESC",
  properties: {
    name: { type: "string", description: "Organization name" },
    adminUserId: { type: "integer", description: "Primary admin user ID" },
    gstNumber: { type: "string", description: "GST number" },
    panNumber: { type: "string", description: "PAN number" },
    tanNumber: { type: "string", description: "TAN number" },
    cin: { type: "string", description: "Corporate Identification Number" },
    registrationNumber: { type: "string", description: "Business registration number" },
    businessType: { 
      type: "string",
      enum: ["proprietorship", "partnership", "llp", "private_limited", "public_limited"],
      description: "Type of business" 
    },
    industry: { type: "string", description: "Industry/sector" },
    address: { type: "string", description: "Registered address JSON" },
    billingAddress: { type: "string", description: "Billing address JSON" },
    shippingAddress: { type: "string", description: "Shipping address JSON" },
    primaryContact: { type: "string", description: "Primary contact JSON" },
    financeContact: { type: "string", description: "Finance contact JSON" },
    defaultPaymentTerms: { 
      type: "string",
      enum: ["net15", "net30", "net45", "net60", "due_on_receipt"],
      default: "net30",
      description: "Default payment terms" 
    },
    creditLimit: { type: "number", default: 0, description: "Credit limit" },
    currentBalance: { type: "number", default: 0, description: "Current outstanding balance" },
    volumeDiscountTier: { 
      type: "string",
      enum: ["none", "bronze", "silver", "gold", "platinum"],
      default: "none",
      description: "Volume discount tier" 
    },
    customPricing: { type: "string", description: "Custom pricing rules JSON" },
    subscriptionPlan: { type: "string", description: "Subscription plan" },
    status: { 
      type: "string",
      enum: ["active", "suspended", "inactive"],
      default: "active",
      description: "Organization status" 
    },
  },
  required: ["name", "adminUserId"],
};
