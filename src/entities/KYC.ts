import type { EntityConfig } from "../hooks/useEntity";

export const kycEntityConfig: EntityConfig = {
  name: "KYC",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "integer", description: "User ID" },
    aadharNumber: { type: "string", description: "Aadhar number" },
    aadharName: { type: "string", description: "Name on Aadhar" },
    aadharVerified: { type: "string", default: "false", description: "Aadhar OTP verified" },
    panNumber: { type: "string", description: "PAN number" },
    panVerified: { type: "string", default: "false", description: "PAN verified" },
    bankAccountNumber: { type: "string", description: "Bank account number" },
    bankIfsc: { type: "string", description: "Bank IFSC code" },
    bankName: { type: "string", description: "Bank name" },
    bankVerified: { type: "string", default: "false", description: "Bank verified" },
    status: {
      type: "string",
      enum: ["pending", "under_review", "verified", "rejected"],
      default: "pending",
      description: "KYC status"
    },
    rejectionReason: { type: "string", description: "Rejection reason if rejected" },
    documentsUrl: { type: "string", description: "Uploaded documents URLs JSON" },
    verifiedBy: { type: "integer", description: "Admin user ID who verified" },
    verifiedAt: { type: "string", format: "date", description: "Verification timestamp" }
  },
  required: ["userId", "aadharNumber"]
};
