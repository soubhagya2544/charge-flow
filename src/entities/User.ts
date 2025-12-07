import type { EntityConfig } from "../hooks/useEntity";

export const userEntityConfig: EntityConfig = {
  name: "User",
  orderBy: "created_at DESC",
  properties: {
    email: { type: "string", description: "User email" },
    password: { type: "string", description: "Hashed password" },
    name: { type: "string", description: "Full name" },
    phone: { type: "string", description: "Phone number" },
    role: {
      type: "string",
      enum: ["admin", "api_user", "master_distributor", "distributor", "retailer", "customer"],
      default: "customer",
      description: "User role"
    },
    status: {
      type: "string",
      enum: ["active", "inactive", "suspended"],
      default: "active",
      description: "Account status"
    },
    walletBalance: { type: "number", default: "0", description: "Wallet balance in INR" },
    kycStatus: {
      type: "string",
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      description: "KYC verification status"
    },
    aadharNumber: { type: "string", description: "Aadhar number" },
    parentId: { type: "integer", description: "Parent user ID for referral tree" },
    referralCode: { type: "string", description: "Unique referral code" },
    ipAddress: { type: "string", description: "Approved IP address" },
    packageId: { type: "integer", description: "Assigned package ID" },
    commission: { type: "string", description: "Commission rates JSON" },
    bankDetails: { type: "string", description: "Bank account details JSON" },
    profileImage: { type: "string", description: "Profile image URL" },
    lastLogin: { type: "string", format: "date", description: "Last login timestamp" }
  },
  required: ["email", "password", "name", "phone", "role"]
};
