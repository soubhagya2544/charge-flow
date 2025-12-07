import { useState } from "react";
import { useEntity } from "../../hooks/useEntity";
import {
  invoiceEntityConfig,
  subscriptionEntityConfig,
  paymentMethodEntityConfig,
} from "../../entities";
import {
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  Star,
  Eye,
} from "lucide-react";

type Invoice = {
  id: number;
  userId: number;
  invoiceNumber: string;
  invoiceType: "subscription" | "transaction" | "commission" | "refund";
  amount: number;
  tax: number;
  totalAmount: number;
  status: "paid" | "pending" | "overdue" | "cancelled";
  dueDate: string;
  paidDate: string;
  description: string;
  billingPeriod: string;
  paymentMethod: string;
  transactionIds: string;
  created_at: string;
  updated_at: string;
};

type Subscription = {
  id: number;
  userId: number;
  packageId: number;
  planName: string;
  planType: "monthly" | "quarterly" | "half-yearly" | "yearly";
  amount: number;
  status: "active" | "expired" | "cancelled" | "suspended";
  startDate: string;
  endDate: string;
  nextBillingDate: string;
  autoRenew: string;
  features: string;
  created_at: string;
  updated_at: string;
};

type PaymentMethod = {
  id: number;
  userId: number;
  methodType: "card" | "upi" | "netbanking" | "wallet";
  isDefault: string;
  cardLast4?: string;
  cardBrand?: string;
  cardExpiry?: string;
  cardholderName?: string;
  upiId?: string;
  bankName?: string;
  accountLast4?: string;
  walletProvider?: string;
  walletNumber?: string;
  nickname?: string;
  status: "active" | "expired" | "disabled";
  created_at: string;
  updated_at: string;
};

export default function BillingInvoices() {
  const [activeTab, setActiveTab] = useState<
    "subscription" | "invoices" | "payment-methods"
  >("subscription");
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const {
    items: invoices,
    loading: invoicesLoading,
    create: createInvoice,
  } = useEntity<Invoice>(invoiceEntityConfig);

  const {
    items: subscriptions,
    loading: subscriptionsLoading,
    update: updateSubscription,
  } = useEntity<Subscription>(subscriptionEntityConfig);

  const {
    items: paymentMethods,
    loading: paymentMethodsLoading,
    create: createPaymentMethod,
    update: updatePaymentMethod,
    remove: removePaymentMethod,
  } = useEntity<PaymentMethod>(paymentMethodEntityConfig);

  const currentSubscription = subscriptions[0];

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Generate invoice PDF/download
    const invoiceData = `
CHARGE FLOW - TAX INVOICE
======================================
Invoice Number: ${invoice.invoiceNumber}
Date: ${new Date(invoice.created_at).toLocaleDateString()}
Billing Period: ${invoice.billingPeriod}

BILL TO:
User ID: ${invoice.userId}

DESCRIPTION:
${invoice.description}

Amount: ₹${invoice.amount.toFixed(2)}
Tax (18%): ₹${invoice.tax.toFixed(2)}
--------------------------------------
TOTAL: ₹${invoice.totalAmount.toFixed(2)}

Status: ${invoice.status.toUpperCase()}
Payment Method: ${invoice.paymentMethod}
${invoice.paidDate ? `Paid Date: ${new Date(invoice.paidDate).toLocaleDateString()}` : `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`}

Thank you for your business!
    `;

    const blob = new Blob([invoiceData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${invoice.invoiceNumber}.txt`;
    a.click();
  };

  const handleToggleAutoRenew = async () => {
    if (currentSubscription) {
      await updateSubscription(currentSubscription.id, {
        autoRenew: currentSubscription.autoRenew === "true" ? "false" : "true",
      });
    }
  };

  const handleSetDefaultPayment = async (methodId: number) => {
    // Set all to non-default
    for (const method of paymentMethods) {
      if (method.id === methodId) {
        await updatePaymentMethod(methodId, { isDefault: "true" });
      } else if (method.isDefault === "true") {
        await updatePaymentMethod(method.id, { isDefault: "false" });
      }
    }
  };

  const handleDeletePaymentMethod = async (methodId: number) => {
    if (confirm("Are you sure you want to delete this payment method?")) {
      await removePaymentMethod(methodId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "active":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "overdue":
        return "text-red-600 bg-red-50";
      case "cancelled":
      case "expired":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4" />;
      case "cancelled":
      case "expired":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-5 w-5" />;
      case "upi":
        return <span className="text-lg font-bold">₹</span>;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const formatPaymentMethodDisplay = (method: PaymentMethod) => {
    switch (method.methodType) {
      case "card":
        return `${method.cardBrand} •••• ${method.cardLast4}`;
      case "upi":
        return method.upiId;
      case "netbanking":
        return `${method.bankName} •••• ${method.accountLast4}`;
      case "wallet":
        return `${method.walletProvider} - ${method.walletNumber}`;
      default:
        return "Payment Method";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Billing & Invoices
        </h1>
        <p className="text-gray-600">
          Manage your subscription, view invoices, and update payment methods
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("subscription")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "subscription"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Subscription
          </button>
          <button
            onClick={() => setActiveTab("invoices")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "invoices"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Invoice History
          </button>
          <button
            onClick={() => setActiveTab("payment-methods")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "payment-methods"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Payment Methods
          </button>
        </nav>
      </div>

      {/* Subscription Tab */}
      {activeTab === "subscription" && (
        <div className="space-y-6">
          {subscriptionsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading subscription...</p>
            </div>
          ) : currentSubscription ? (
            <>
              {/* Current Plan Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white shadow-lg">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {currentSubscription.planName}
                    </h2>
                    <p className="text-blue-100 capitalize">
                      {currentSubscription.planType} Plan
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full font-medium ${
                      currentSubscription.status === "active"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {currentSubscription.status.charAt(0).toUpperCase() +
                      currentSubscription.status.slice(1)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Amount</p>
                    <p className="text-2xl font-bold">
                      ₹{currentSubscription.amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Start Date</p>
                    <p className="font-semibold">
                      {new Date(
                        currentSubscription.startDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm mb-1">End Date</p>
                    <p className="font-semibold">
                      {new Date(
                        currentSubscription.endDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {currentSubscription.features && (
                  <div className="mt-6 pt-6 border-t border-blue-500">
                    <p className="text-blue-100 text-sm mb-3">Plan Features:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {JSON.parse(currentSubscription.features).map(
                        (feature: string, index: number) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Next Billing */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-blue-600 mr-4" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Next Billing Date
                      </h3>
                      <p className="text-gray-600">
                        {new Date(
                          currentSubscription.nextBillingDate
                        ).toLocaleDateString()}{" "}
                        - ₹{currentSubscription.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentSubscription.autoRenew === "true"}
                        onChange={handleToggleAutoRenew}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Auto-Renew
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Upgrade Options */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Upgrade Your Plan
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {["quarterly", "half-yearly", "yearly"].map((plan) => (
                    <div
                      key={plan}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer"
                    >
                      <h4 className="font-semibold capitalize mb-2">{plan}</h4>
                      <p className="text-2xl font-bold text-blue-600 mb-2">
                        ₹
                        {plan === "quarterly"
                          ? "2,997"
                          : plan === "half-yearly"
                          ? "5,994"
                          : "11,988"}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        Save{" "}
                        {plan === "quarterly"
                          ? "10%"
                          : plan === "half-yearly"
                          ? "15%"
                          : "20%"}
                      </p>
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Upgrade
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Active Subscription
              </h3>
              <p className="text-gray-600 mb-6">
                Choose a plan to get started with Charge Flow
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                View Plans
              </button>
            </div>
          )}
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === "invoices" && (
        <div className="space-y-6">
          {invoicesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading invoices...</p>
            </div>
          ) : invoices.length > 0 ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-sm">Total Paid</span>
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹
                    {invoices
                      .filter((inv) => inv.status === "paid")
                      .reduce((sum, inv) => sum + inv.totalAmount, 0)
                      .toFixed(2)}
                  </p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-sm">Pending</span>
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {invoices.filter((inv) => inv.status === "pending").length}
                  </p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-sm">Overdue</span>
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {invoices.filter((inv) => inv.status === "overdue").length}
                  </p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-sm">
                      Total Invoices
                    </span>
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {invoices.length}
                  </p>
                </div>
              </div>

              {/* Invoice List */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Invoice
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Billing Period
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {invoices.map((invoice) => (
                        <tr
                          key={invoice.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {invoice.invoiceNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(
                                invoice.created_at
                              ).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900 capitalize">
                              {invoice.invoiceType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {invoice.billingPeriod}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              ₹{invoice.totalAmount.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              +₹{invoice.tax.toFixed(2)} tax
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                invoice.status
                              )}`}
                            >
                              {getStatusIcon(invoice.status)}
                              <span className="ml-1 capitalize">
                                {invoice.status}
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {invoice.status === "paid"
                              ? new Date(invoice.paidDate).toLocaleDateString()
                              : new Date(invoice.dueDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setSelectedInvoice(invoice)}
                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                title="View Details"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDownloadInvoice(invoice)}
                                className="text-green-600 hover:text-green-900 transition-colors"
                                title="Download Invoice"
                              >
                                <Download className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Invoices Found
              </h3>
              <p className="text-gray-600">
                Your invoice history will appear here
              </p>
            </div>
          )}
        </div>
      )}

      {/* Payment Methods Tab */}
      {activeTab === "payment-methods" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Payment Methods
              </h2>
              <p className="text-gray-600">
                Manage your saved payment methods
              </p>
            </div>
            <button
              onClick={() => setShowAddPayment(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Payment Method
            </button>
          </div>

          {paymentMethodsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading payment methods...</p>
            </div>
          ) : paymentMethods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`bg-white rounded-lg border-2 p-6 transition-all ${
                    method.isDefault === "true"
                      ? "border-blue-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-lg p-3 mr-4">
                        {getPaymentMethodIcon(method.methodType)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {method.nickname || formatPaymentMethodDisplay(method)}
                        </h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {method.methodType}
                        </p>
                      </div>
                    </div>
                    {method.isDefault === "true" && (
                      <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Default
                      </span>
                    )}
                  </div>

                  {method.methodType === "card" && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        {method.cardholderName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Expires {method.cardExpiry}
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {method.isDefault !== "true" && (
                      <button
                        onClick={() => handleSetDefaultPayment(method.id)}
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletePaymentMethod(method.id)}
                      className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Payment Methods Added
              </h3>
              <p className="text-gray-600 mb-6">
                Add a payment method to make transactions easier
              </p>
              <button
                onClick={() => setShowAddPayment(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Payment Method
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showAddPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Add Payment Method
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const methodType = formData.get("methodType") as string;

                const baseData = {
                  userId: 1,
                  methodType: methodType as "card" | "upi" | "netbanking" | "wallet",
                  nickname: formData.get("nickname") as string,
                  status: "active" as const,
                };

                if (methodType === "card") {
                  await createPaymentMethod({
                    ...baseData,
                    isDefault: "false",
                    cardLast4: (formData.get("cardNumber") as string).slice(-4),
                    cardBrand: "Visa",
                    cardExpiry: formData.get("cardExpiry") as string,
                    cardholderName: formData.get("cardholderName") as string,
                  });
                } else if (methodType === "upi") {
                  await createPaymentMethod({
                    ...baseData,
                    isDefault: "false",
                    upiId: formData.get("upiId") as string,
                  });
                }

                setShowAddPayment(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Type
                </label>
                <select
                  name="methodType"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="netbanking">Net Banking</option>
                  <option value="wallet">Wallet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nickname (Optional)
                </label>
                <input
                  type="text"
                  name="nickname"
                  placeholder="e.g., Personal Card"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number / UPI ID
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="4111 1111 1111 1111 or user@upi"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    name="cardExpiry"
                    placeholder="12/25"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    maxLength={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardholderName"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddPayment(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Payment Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Invoice Details
                </h3>
                <p className="text-gray-600">
                  Invoice #{selectedInvoice.invoiceNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Invoice Date</p>
                    <p className="font-semibold">
                      {new Date(selectedInvoice.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        selectedInvoice.status
                      )}`}
                    >
                      {getStatusIcon(selectedInvoice.status)}
                      <span className="ml-1 capitalize">
                        {selectedInvoice.status}
                      </span>
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Billing Period</p>
                    <p className="font-semibold">
                      {selectedInvoice.billingPeriod}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-semibold">
                      {selectedInvoice.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-gray-900">{selectedInvoice.description}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    ₹{selectedInvoice.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-semibold">
                    ₹{selectedInvoice.tax.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg text-blue-600">
                    ₹{selectedInvoice.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleDownloadInvoice(selectedInvoice)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Invoice
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
