import { useState } from "react";
import { useEntity } from "../../hooks/useEntity";
import {
  b2bInvoiceEntityConfig,
  b2bOrganizationEntityConfig,
  b2bTaxReportEntityConfig,
  b2bUserAccessEntityConfig,
} from "../../entities";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
  Building2,
  FileText,
  Download,
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  Plus,
  Filter,
  Eye,
  Edit,
  Mail,
  Shield,
  FileSpreadsheet,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";

type B2BInvoice = {
  id: number;
  userId: number;
  organizationName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string;
  customPaymentTerms: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  discountType: string;
  totalAmount: number;
  status: string;
  currency: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  customFields: string;
  lineItems: string;
  notes: string;
  internalNotes: string;
  paidAmount: number;
  paidDate: string;
  gstNumber: string;
  panNumber: string;
  billingAddress: string;
  shippingAddress: string;
  created_at: string;
  updated_at: string;
};

type B2BOrganization = {
  id: number;
  name: string;
  adminUserId: number;
  gstNumber: string;
  panNumber: string;
  tanNumber: string;
  cin: string;
  registrationNumber: string;
  businessType: string;
  industry: string;
  address: string;
  billingAddress: string;
  shippingAddress: string;
  primaryContact: string;
  financeContact: string;
  defaultPaymentTerms: string;
  creditLimit: number;
  currentBalance: number;
  volumeDiscountTier: string;
  customPricing: string;
  subscriptionPlan: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type B2BTaxReport = {
  id: number;
  organizationId: number;
  reportType: string;
  periodStart: string;
  periodEnd: string;
  totalRevenue: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  tds: number;
  totalTax: number;
  inputTaxCredit: number;
  netTaxPayable: number;
  reportData: string;
  generatedDate: string;
  status: string;
  filedDate: string;
  acknowledgmentNumber: string;
  created_at: string;
  updated_at: string;
};

type B2BUserAccess = {
  id: number;
  organizationId: number;
  userId: number;
  role: string;
  permissions: string;
  canViewInvoices: string;
  canCreateInvoices: string;
  canApproveInvoices: string;
  canManagePayments: string;
  canViewReports: string;
  canExportData: string;
  canManageUsers: string;
  status: string;
  invitedBy: number;
  invitedDate: string;
  acceptedDate: string;
  created_at: string;
  updated_at: string;
};

type B2BBillingPanelProps = {
  userEmail: string;
};

export default function B2BBillingPanel({ userEmail }: B2BBillingPanelProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedInvoice, setSelectedInvoice] = useState<B2BInvoice | null>(null);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showInviteUser, setShowInviteUser] = useState(false);

  const { items: invoices, loading: loadingInvoices, create: createInvoice, update: updateInvoice } =
    useEntity<B2BInvoice>(b2bInvoiceEntityConfig);
  const { items: organizations, loading: loadingOrgs, create: createOrganization, update: updateOrganization } =
    useEntity<B2BOrganization>(b2bOrganizationEntityConfig);
  const { items: taxReports, loading: loadingReports, create: createTaxReport } =
    useEntity<B2BTaxReport>(b2bTaxReportEntityConfig);
  const { items: userAccess, loading: loadingUsers, create: createUserAccess } =
    useEntity<B2BUserAccess>(b2bUserAccessEntityConfig);

  const currentOrg = organizations[0] || null;

  // Calculate stats
  const totalRevenue = invoices.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.totalAmount, 0);
  const pendingAmount = invoices.filter(inv => inv.status === "sent").reduce((sum, inv) => sum + inv.totalAmount, 0);
  const overdueAmount = invoices.filter(inv => inv.status === "overdue").reduce((sum, inv) => sum + inv.totalAmount, 0);
  const thisMonthRevenue = invoices.filter(inv => 
    inv.status === "paid" && 
    new Date(inv.paidDate).getMonth() === new Date().getMonth()
  ).reduce((sum, inv) => sum + inv.totalAmount, 0);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-100 text-gray-800",
      sent: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      partial: "bg-yellow-100 text-yellow-800",
      overdue: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-600",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getDiscountTierPercentage = (tier: string) => {
    const discounts: Record<string, number> = {
      none: 0,
      bronze: 5,
      silver: 10,
      gold: 15,
      platinum: 20,
    };
    return discounts[tier] || 0;
  };

  const handleCreateInvoice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const subtotal = parseFloat(formData.get("subtotal") as string);
    const taxRate = parseFloat(formData.get("taxRate") as string) / 100;
    const discountRate = currentOrg ? getDiscountTierPercentage(currentOrg.volumeDiscountTier) / 100 : 0;
    
    const discountAmount = subtotal * discountRate;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * taxRate;
    const totalAmount = taxableAmount + taxAmount;

    await createInvoice({
      userId: 1,
      organizationName: currentOrg?.name || "Default Organization",
      invoiceNumber: `INV-${Date.now()}`,
      invoiceDate: formData.get("invoiceDate") as string,
      dueDate: formData.get("dueDate") as string,
      paymentTerms: formData.get("paymentTerms") as string,
      customPaymentTerms: formData.get("customPaymentTerms") as string || "",
      subtotal,
      taxAmount,
      discountAmount,
      discountType: "volume",
      totalAmount,
      status: "draft",
      currency: "INR",
      billingPeriodStart: formData.get("billingPeriodStart") as string,
      billingPeriodEnd: formData.get("billingPeriodEnd") as string,
      customFields: "{}",
      lineItems: formData.get("lineItems") as string,
      notes: formData.get("notes") as string || "",
      internalNotes: formData.get("internalNotes") as string || "",
      paidAmount: 0,
      paidDate: "",
      gstNumber: currentOrg?.gstNumber || "",
      panNumber: currentOrg?.panNumber || "",
      billingAddress: currentOrg?.billingAddress || "{}",
      shippingAddress: currentOrg?.shippingAddress || "{}",
    });

    setShowCreateInvoice(false);
  };

  const handleInviteUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await createUserAccess({
      organizationId: currentOrg?.id || 1,
      userId: Math.floor(Math.random() * 10000),
      role: formData.get("role") as string,
      permissions: JSON.stringify([]),
      canViewInvoices: formData.get("canViewInvoices") ? "true" : "false",
      canCreateInvoices: formData.get("canCreateInvoices") ? "true" : "false",
      canApproveInvoices: formData.get("canApproveInvoices") ? "true" : "false",
      canManagePayments: formData.get("canManagePayments") ? "true" : "false",
      canViewReports: formData.get("canViewReports") ? "true" : "false",
      canExportData: formData.get("canExportData") ? "true" : "false",
      canManageUsers: formData.get("canManageUsers") ? "true" : "false",
      status: "pending",
      invitedBy: 1,
      invitedDate: new Date().toISOString().split("T")[0],
      acceptedDate: "",
    });

    setShowInviteUser(false);
  };

  const generateTaxReport = async () => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    const endDate = new Date();

    const monthlyInvoices = invoices.filter(inv => {
      const invDate = new Date(inv.invoiceDate);
      return invDate >= startDate && invDate <= endDate && inv.status === "paid";
    });

    const totalRevenue = monthlyInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalTax = monthlyInvoices.reduce((sum, inv) => sum + inv.taxAmount, 0);
    const cgst = totalTax / 2;
    const sgst = totalTax / 2;

    await createTaxReport({
      organizationId: currentOrg?.id || 1,
      reportType: "gst_monthly",
      periodStart: startDate.toISOString().split("T")[0],
      periodEnd: endDate.toISOString().split("T")[0],
      totalRevenue,
      taxableAmount: totalRevenue - totalTax,
      cgst,
      sgst,
      igst: 0,
      tds: 0,
      totalTax,
      inputTaxCredit: 0,
      netTaxPayable: totalTax,
      reportData: JSON.stringify({ invoices: monthlyInvoices.length }),
      generatedDate: new Date().toISOString().split("T")[0],
      status: "draft",
      filedDate: "",
      acknowledgmentNumber: "",
    });
  };

  if (loadingInvoices || loadingOrgs) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading B2B Billing Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">B2B Billing Portal</h1>
            <p className="text-gray-600 mt-1">
              {currentOrg ? currentOrg.name : "Manage your organization's billing and invoices"}
            </p>
          </div>
          <Dialog open={showCreateInvoice} onOpenChange={setShowCreateInvoice}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>
                  Generate a custom invoice with volume-based discounts
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateInvoice} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invoiceDate">Invoice Date</Label>
                    <Input
                      id="invoiceDate"
                      name="invoiceDate"
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentTerms">Payment Terms</Label>
                    <Select name="paymentTerms" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="net15">Net 15 Days</SelectItem>
                        <SelectItem value="net30">Net 30 Days</SelectItem>
                        <SelectItem value="net45">Net 45 Days</SelectItem>
                        <SelectItem value="net60">Net 60 Days</SelectItem>
                        <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" name="dueDate" type="date" required />
                  </div>
                  <div>
                    <Label htmlFor="customPaymentTerms">Custom Terms (Optional)</Label>
                    <Input
                      id="customPaymentTerms"
                      name="customPaymentTerms"
                      placeholder="e.g., 2% discount for early payment"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="billingPeriodStart">Billing Period Start</Label>
                    <Input id="billingPeriodStart" name="billingPeriodStart" type="date" required />
                  </div>
                  <div>
                    <Label htmlFor="billingPeriodEnd">Billing Period End</Label>
                    <Input id="billingPeriodEnd" name="billingPeriodEnd" type="date" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subtotal">Subtotal (₹)</Label>
                    <Input
                      id="subtotal"
                      name="subtotal"
                      type="number"
                      step="0.01"
                      placeholder="10000.00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      name="taxRate"
                      type="number"
                      step="0.01"
                      defaultValue="18"
                      placeholder="18"
                      required
                    />
                  </div>
                </div>
                {currentOrg && currentOrg.volumeDiscountTier !== "none" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-semibold">
                        Volume Discount: {getDiscountTierPercentage(currentOrg.volumeDiscountTier)}% ({currentOrg.volumeDiscountTier.toUpperCase()} Tier)
                      </span>
                    </div>
                  </div>
                )}
                <div>
                  <Label htmlFor="lineItems">Line Items (JSON)</Label>
                  <Textarea
                    id="lineItems"
                    name="lineItems"
                    placeholder='[{"description": "API Calls - 10,000", "quantity": 1, "rate": 10000}]'
                    className="font-mono text-sm"
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Customer Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Thank you for your business!"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="internalNotes">Internal Notes (Private)</Label>
                  <Textarea
                    id="internalNotes"
                    name="internalNotes"
                    placeholder="Notes for internal team only"
                    rows={2}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreateInvoice(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Create Invoice
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">₹{pendingAmount.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">{invoices.filter(i => i.status === "sent").length} invoices</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₹{overdueAmount.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">{invoices.filter(i => i.status === "overdue").length} invoices</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{thisMonthRevenue.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">Revenue collected</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white p-1">
            <TabsTrigger value="overview">
              <Building2 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="invoices">
              <FileText className="w-4 h-4 mr-2" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="tax-reports">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Tax Reports
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              User Access
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Shield className="w-4 h-4 mr-2" />
              Organization
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentOrg ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Business Type:</span>
                        <span className="font-semibold">{currentOrg.businessType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">GST Number:</span>
                        <span className="font-mono">{currentOrg.gstNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">PAN Number:</span>
                        <span className="font-mono">{currentOrg.panNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Terms:</span>
                        <span className="font-semibold">{currentOrg.defaultPaymentTerms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Volume Tier:</span>
                        <Badge className="bg-purple-100 text-purple-800">
                          {currentOrg.volumeDiscountTier.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Credit Limit:</span>
                        <span className="font-semibold">₹{currentOrg.creditLimit.toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No organization configured</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  {invoices.slice(0, 5).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div>
                        <p className="font-semibold">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-500">{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{invoice.totalAmount.toLocaleString()}</p>
                        <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                      </div>
                    </div>
                  ))}
                  {invoices.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No invoices yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Volume-Based Discount Tiers</CardTitle>
                <CardDescription>Unlock higher discounts based on your transaction volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {["none", "bronze", "silver", "gold", "platinum"].map((tier) => (
                    <div
                      key={tier}
                      className={`border-2 rounded-lg p-4 text-center ${
                        currentOrg?.volumeDiscountTier === tier
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <h3 className="font-bold text-lg capitalize">{tier}</h3>
                      <p className="text-3xl font-bold text-blue-600 my-2">
                        {getDiscountTierPercentage(tier)}%
                      </p>
                      <p className="text-xs text-gray-600">discount</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Invoices</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Invoice #</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Due Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Discount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-sm">{invoice.invoiceNumber}</td>
                          <td className="py-3 px-4">{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                          <td className="py-3 px-4">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                          <td className="py-3 px-4 font-semibold">₹{invoice.totalAmount.toLocaleString()}</td>
                          <td className="py-3 px-4 text-green-600">-₹{invoice.discountAmount.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedInvoice(invoice)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {invoices.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No invoices found</p>
                      <p className="text-gray-400 text-sm">Create your first invoice to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tax Reports Tab */}
          <TabsContent value="tax-reports" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Tax & Compliance Reports</CardTitle>
                    <CardDescription>GST, TDS, and income tax reports for accounting</CardDescription>
                  </div>
                  <Button onClick={generateTaxReport} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {taxReports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                            <div>
                              <h3 className="font-semibold text-lg">{report.reportType.replace("_", " ").toUpperCase()}</h3>
                              <p className="text-sm text-gray-600">
                                Period: {new Date(report.periodStart).toLocaleDateString()} - {new Date(report.periodEnd).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-4 mt-4">
                            <div>
                              <p className="text-xs text-gray-500">Total Revenue</p>
                              <p className="font-semibold">₹{report.totalRevenue.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">CGST</p>
                              <p className="font-semibold">₹{report.cgst.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">SGST</p>
                              <p className="font-semibold">₹{report.sgst.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Net Tax Payable</p>
                              <p className="font-semibold text-blue-600">₹{report.netTaxPayable.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {taxReports.length === 0 && (
                    <div className="text-center py-12">
                      <FileSpreadsheet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No tax reports generated yet</p>
                      <p className="text-gray-400 text-sm mb-4">Generate your first tax report for compliance</p>
                      <Button onClick={generateTaxReport} className="bg-blue-600 hover:bg-blue-700">
                        Generate GST Report
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Access Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Multi-User Access Management</CardTitle>
                    <CardDescription>Invite team members and manage their permissions</CardDescription>
                  </div>
                  <Dialog open={showInviteUser} onOpenChange={setShowInviteUser}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Mail className="w-4 h-4 mr-2" />
                        Invite User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite Team Member</DialogTitle>
                        <DialogDescription>
                          Grant access to your billing portal with custom permissions
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleInviteUser} className="space-y-4">
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="user@example.com"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Select name="role" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin - Full Access</SelectItem>
                              <SelectItem value="finance_manager">Finance Manager - Billing & Payments</SelectItem>
                              <SelectItem value="accountant">Accountant - Reports & Tax</SelectItem>
                              <SelectItem value="approver">Approver - Invoice Approval</SelectItem>
                              <SelectItem value="viewer">Viewer - Read Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Permissions</Label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="canViewInvoices" name="canViewInvoices" defaultChecked />
                              <label htmlFor="canViewInvoices" className="text-sm">View Invoices</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="canCreateInvoices" name="canCreateInvoices" />
                              <label htmlFor="canCreateInvoices" className="text-sm">Create Invoices</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="canApproveInvoices" name="canApproveInvoices" />
                              <label htmlFor="canApproveInvoices" className="text-sm">Approve Invoices</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="canManagePayments" name="canManagePayments" />
                              <label htmlFor="canManagePayments" className="text-sm">Manage Payments</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="canViewReports" name="canViewReports" defaultChecked />
                              <label htmlFor="canViewReports" className="text-sm">View Reports</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="canExportData" name="canExportData" />
                              <label htmlFor="canExportData" className="text-sm">Export Data</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="canManageUsers" name="canManageUsers" />
                              <label htmlFor="canManageUsers" className="text-sm">Manage Users</label>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setShowInviteUser(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            Send Invitation
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userAccess.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold">User #{user.userId}</p>
                          <p className="text-sm text-gray-600">{user.role.replace("_", " ").toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1">
                          {user.canViewInvoices === "true" && (
                            <Badge variant="outline" className="text-xs">View Invoices</Badge>
                          )}
                          {user.canCreateInvoices === "true" && (
                            <Badge variant="outline" className="text-xs">Create Invoices</Badge>
                          )}
                          {user.canManagePayments === "true" && (
                            <Badge variant="outline" className="text-xs">Manage Payments</Badge>
                          )}
                        </div>
                        <Badge className={user.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                          {user.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {userAccess.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No team members yet</p>
                      <p className="text-gray-400 text-sm mb-4">Invite your team to collaborate on billing</p>
                      <Button onClick={() => setShowInviteUser(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Mail className="w-4 h-4 mr-2" />
                        Invite First User
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organization Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Settings</CardTitle>
                <CardDescription>Manage your organization profile and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                {currentOrg ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Organization Name</Label>
                        <Input defaultValue={currentOrg.name} />
                      </div>
                      <div>
                        <Label>Business Type</Label>
                        <Select defaultValue={currentOrg.businessType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="proprietorship">Proprietorship</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="llp">LLP</SelectItem>
                            <SelectItem value="private_limited">Private Limited</SelectItem>
                            <SelectItem value="public_limited">Public Limited</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>GST Number</Label>
                        <Input defaultValue={currentOrg.gstNumber} />
                      </div>
                      <div>
                        <Label>PAN Number</Label>
                        <Input defaultValue={currentOrg.panNumber} />
                      </div>
                      <div>
                        <Label>TAN Number</Label>
                        <Input defaultValue={currentOrg.tanNumber} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Default Payment Terms</Label>
                        <Select defaultValue={currentOrg.defaultPaymentTerms}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="net15">Net 15 Days</SelectItem>
                            <SelectItem value="net30">Net 30 Days</SelectItem>
                            <SelectItem value="net45">Net 45 Days</SelectItem>
                            <SelectItem value="net60">Net 60 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Credit Limit (₹)</Label>
                        <Input type="number" defaultValue={currentOrg.creditLimit} />
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No organization configured</p>
                    <p className="text-gray-400 text-sm mb-4">Create your organization profile to get started</p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Create Organization
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Invoice Detail Dialog */}
        {selectedInvoice && (
          <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Invoice Details - {selectedInvoice.invoiceNumber}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Invoice Date</p>
                    <p className="font-semibold">{new Date(selectedInvoice.invoiceDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className="font-semibold">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Terms</p>
                    <p className="font-semibold">{selectedInvoice.paymentTerms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className={getStatusColor(selectedInvoice.status)}>{selectedInvoice.status}</Badge>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{selectedInvoice.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({selectedInvoice.discountType}):</span>
                      <span>-₹{selectedInvoice.discountAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (GST):</span>
                      <span>₹{selectedInvoice.taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total Amount:</span>
                      <span>₹{selectedInvoice.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                {selectedInvoice.notes && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600">Notes</p>
                    <p>{selectedInvoice.notes}</p>
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invoice
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
