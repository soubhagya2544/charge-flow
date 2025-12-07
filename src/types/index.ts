export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: "admin" | "api_user" | "master_distributor" | "distributor" | "retailer" | "customer";
  status: "active" | "inactive" | "suspended";
  walletBalance: number;
  kycStatus: "pending" | "submitted" | "verified" | "rejected";
  aadharNumber?: string;
  panNumber?: string;
  address?: string;
  parentId?: number;
  referralCode: string;
  ipAddress?: string;
  packageId?: number;
  commission?: string;
  bankDetails?: string;
  profileImage?: string;
  lastLogin?: string;
  created_at: string;
  updated_at: string;
};

export type ApiConfig = {
  id: number;
  name: string;
  type: "recharge" | "dth" | "electricity" | "water" | "gas" | "broadband" | "insurance" | "loan" | "other";
  endpoint: string;
  authKey: string;
  authType: "bearer" | "api_key" | "basic" | "custom";
  priority: number;
  status: "active" | "inactive" | "maintenance";
  commission: number;
  parameters: string;
  headers: string;
  successCodes: string;
  testMode: string;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: number;
  userId: number;
  type: "recharge" | "dth" | "electricity" | "water" | "gas" | "broadband" | "insurance" | "loan" | "wallet_credit" | "wallet_debit" | "commission_credit" | "fund_transfer";
  amount: number;
  status: "pending" | "success" | "failed" | "refunded";
  operatorName: string;
  accountNumber: string;
  apiId: number;
  apiResponse: string;
  orderId: string;
  operatorRef: string;
  commission: number;
  parentCommission: string;
  beforeBalance: number;
  afterBalance: number;
  remarks: string;
  invoiceUrl: string;
  created_at: string;
  updated_at: string;
};

export type Commission = {
  id: number;
  role: "api_user" | "master_distributor" | "distributor" | "retailer";
  serviceType: "recharge" | "dth" | "electricity" | "water" | "gas" | "broadband" | "insurance" | "loan" | "all";
  inCommission: number;
  outCommission: number;
  minAmount: number;
  maxAmount: number;
  status: "active" | "inactive";
  packageId: number;
  operatorName: string;
  created_at: string;
  updated_at: string;
};

export type Package = {
  id: number;
  name: string;
  description: string;
  price: number;
  validityDays: number;
  features: string;
  commissionRates: string;
  apiAccess: string;
  transactionLimit: number;
  status: "active" | "inactive";
  popular: string;
  created_at: string;
  updated_at: string;
};

export type Referral = {
  id: number;
  referrerId: number;
  referredId: number;
  referralCode: string;
  status: "pending" | "active" | "completed";
  reward: number;
  rewardPaid: string;
  level: number;
  transactionCount: number;
  totalBusiness: number;
  created_at: string;
  updated_at: string;
};

export type KYC = {
  id: number;
  userId: number;
  aadharNumber: string;
  aadharName: string;
  aadharVerified: string;
  panNumber: string;
  panVerified: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankName: string;
  bankVerified: string;
  status: "pending" | "under_review" | "verified" | "rejected";
  rejectionReason: string;
  documentsUrl: string;
  verifiedBy: number;
  verifiedAt: string;
  created_at: string;
  updated_at: string;
};

export type FundOrder = {
  id: number;
  userId: number;
  amount: number;
  paymentMode: "bank_transfer" | "upi" | "cash_deposit" | "gateway";
  status: "pending" | "approved" | "rejected";
  bankName: string;
  accountNumber: string;
  transactionRef: string;
  receiptUrl: string;
  remarks: string;
  adminRemarks: string;
  approvedBy: number;
  approvedAt: string;
  created_at: string;
  updated_at: string;
};

export type Notification = {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "offer";
  read: string;
  actionUrl: string;
  imageUrl: string;
  expiryDate: string;
  created_at: string;
  updated_at: string;
};

export type Report = {
  id: number;
  reportType: "daily" | "monthly" | "yearly" | "custom";
  startDate: string;
  endDate: string;
  totalTransactions: number;
  totalVolume: number;
  totalCommission: number;
  totalProfit: number;
  successRate: number;
  topServices: string;
  topUsers: string;
  predictions: string;
  generatedBy: number;
  created_at: string;
  updated_at: string;
};
