import type { EntityConfig } from "../hooks/useEntity";

export const reportEntityConfig: EntityConfig = {
  name: "Report",
  orderBy: "created_at DESC",
  properties: {
    reportType: {
      type: "string",
      enum: [
        "transaction_volume",
        "revenue_by_operator",
        "user_activity",
        "commission_summary",
        "wallet_analysis",
        "operator_performance",
        "bus_booking_stats",
        "complaint_analysis",
        "daily_summary",
        "custom",
      ],
      description: "Type of report",
    },
    title: { type: "string", description: "Report title" },
    description: { type: "string", description: "Report description" },
    startDate: { type: "string", format: "date", description: "Report start date" },
    endDate: { type: "string", format: "date", description: "Report end date" },
    filters: { type: "string", description: "JSON string of applied filters" },
    data: { type: "string", description: "JSON string of report data" },
    generatedBy: { type: "string", description: "User email who generated report" },
    format: {
      type: "string",
      enum: ["pdf", "csv", "excel", "json"],
      description: "Export format",
    },
    status: {
      type: "string",
      enum: ["generated", "scheduled", "failed"],
      default: "generated",
      description: "Report status",
    },
  },
  required: ["reportType", "title", "startDate", "endDate", "generatedBy"],
};
