import type { EntityConfig } from "../hooks/useEntity";

export const b2bTaxReportEntityConfig: EntityConfig = {
  name: "B2BTaxReport",
  orderBy: "created_at DESC",
  properties: {
    organizationId: { type: "integer", description: "Organization ID" },
    reportType: { 
      type: "string",
      enum: ["gst_monthly", "gst_quarterly", "gst_annual", "tds", "income_tax", "custom"],
      description: "Type of tax report" 
    },
    periodStart: { type: "string", format: "date", description: "Report period start" },
    periodEnd: { type: "string", format: "date", description: "Report period end" },
    totalRevenue: { type: "number", description: "Total revenue" },
    taxableAmount: { type: "number", description: "Taxable amount" },
    cgst: { type: "number", default: 0, description: "CGST amount" },
    sgst: { type: "number", default: 0, description: "SGST amount" },
    igst: { type: "number", default: 0, description: "IGST amount" },
    tds: { type: "number", default: 0, description: "TDS amount" },
    totalTax: { type: "number", description: "Total tax amount" },
    inputTaxCredit: { type: "number", default: 0, description: "Input tax credit" },
    netTaxPayable: { type: "number", description: "Net tax payable" },
    reportData: { type: "string", description: "Detailed report data JSON" },
    generatedDate: { type: "string", format: "date", description: "Report generation date" },
    status: { 
      type: "string",
      enum: ["draft", "finalized", "filed", "amended"],
      default: "draft",
      description: "Report status" 
    },
    filedDate: { type: "string", format: "date", description: "Filing date" },
    acknowledgmentNumber: { type: "string", description: "Filing acknowledgment number" },
  },
  required: ["organizationId", "reportType", "periodStart", "periodEnd", "totalRevenue"],
};
