import { useState, useEffect } from "react";
import { useEntity } from "../hooks/useEntity";
import { walletEntityConfig, fundRequestEntityConfig, walletTransactionEntityConfig } from "../entities";
import { Wallet, DollarSign, TrendingUp, TrendingDown, AlertCircle, Clock, CheckCircle, XCircle, CreditCard } from "lucide-react";
import ReceiptGenerator from "./ReceiptGenerator";

type WalletEntity = {
  id: number;
  userId: string;
  userEmail: string;
  userName: string;
  userRole: string;
  balance: number;
  totalFunded: number;
  totalCommission: number;
  totalSpent: number;
  lowBalanceThreshold: number;
  status: string;
  created_at: string;
  updated_at: string;
};

type FundRequest = {
  id: number;
  userId: string;
  userEmail: string;
  userName: string;
  userRole: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  bankName: string;
  accountNumber: string;
  paymentProof?: string;
  status: string;
  adminNotes?: string;
  approvedBy?: string;
  approvedAt?: string;
  created_at: string;
  updated_at: string;
};

type WalletTransaction = {
  id: number;
  userId: string;
  userEmail: string;
  userName: string;
  transactionId: string;
  type: string;
  category: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  serviceType?: string;
  operatorName?: string;
  referenceId?: string;
  paymentMethod?: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type WalletManagerProps = {
  userEmail: string;
  userName: string;
  userRole: string;
  isAdmin?: boolean;
};

export default function WalletManager({ userEmail, userName, userRole, isAdmin = false }: WalletManagerProps) {
  const { items: wallets, create: createWallet, update: updateWallet, reload: reloadWallets } = useEntity<WalletEntity>(walletEntityConfig);
  const { items: fundRequests, create: createFundRequest, update: updateFundRequest, reload: reloadFundRequests } = useEntity<FundRequest>(fundRequestEntityConfig);
  const { items: transactions, create: createTransaction } = useEntity<WalletTransaction>(walletTransactionEntityConfig);

  const [activeTab, setActiveTab] = useState<"wallet" | "fund" | "history">("wallet");
  const [showFundRequestForm, setShowFundRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "NEFT",
    transactionId: "",
    bankName: "",
    accountNumber: "",
  });

  const userWallet = wallets.find((w) => w.userEmail === userEmail);
  const userFundRequests = fundRequests.filter((fr) => fr.userEmail === userEmail);
  const userTransactions = transactions.filter((t) => t.userEmail === userEmail);
  const allPendingRequests = fundRequests.filter((fr) => fr.status === "pending");

  // Initialize wallet if it doesn't exist
  useEffect(() => {
    if (!userWallet && userEmail && userName) {
      createWallet({
        userId: userEmail,
        userEmail,
        userName,
        userRole,
        balance: 0,
        totalFunded: 0,
        totalCommission: 0,
        totalSpent: 0,
        lowBalanceThreshold: 100,
        status: "active",
      });
    }
  }, [userWallet, userEmail, userName, userRole, createWallet]);

  const showLowBalanceAlert = userWallet && userWallet.balance < userWallet.lowBalanceThreshold;

  const handleSubmitFundRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!formData.amount || !formData.transactionId) {
        alert('Please fill in Amount and Transaction ID');
        return;
      }

      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      console.log('Submitting fund request:', {
        userId: userEmail,
        userEmail,
        userName,
        userRole,
        amount,
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
      });

      await createFundRequest({
        userId: userEmail,
        userEmail,
        userName,
        userRole,
        amount: amount,
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        status: "pending",
      });

      alert('Fund request submitted successfully! Admin will review and approve.');
      
      setFormData({
        amount: "",
        paymentMethod: "NEFT",
        transactionId: "",
        bankName: "",
        accountNumber: "",
      });
      setShowFundRequestForm(false);
      reloadFundRequests();
    } catch (error) {
      console.error('Error submitting fund request:', error);
      alert('Error submitting fund request. Please try again.');
    }
  };

  const handleApproveFundRequest = async (request: FundRequest) => {
    try {
      // Find the requester's wallet
      const requesterWallet = wallets.find((w) => w.userEmail === request.userEmail);
      if (!requesterWallet) {
        alert('Requester wallet not found');
        return;
      }

      const newBalance = requesterWallet.balance + request.amount;
      const newTotalFunded = requesterWallet.totalFunded + request.amount;

      console.log('Approving fund request:', {
        requestId: request.id,
        walletId: requesterWallet.id,
        amount: request.amount,
        newBalance,
      });

      // Update wallet
      await updateWallet(requesterWallet.id, {
        balance: newBalance,
        totalFunded: newTotalFunded,
      });

      // Update fund request
      await updateFundRequest(request.id, {
        status: "approved",
        approvedBy: userName,
        approvedAt: new Date().toISOString(),
      });

      // Create transaction record
      await createTransaction({
        userId: request.userEmail,
        userEmail: request.userEmail,
        userName: request.userName,
        transactionId: `TXN${Date.now()}`,
        type: "credit",
        category: "fund_request",
        amount: request.amount,
        balanceBefore: requesterWallet.balance,
        balanceAfter: newBalance,
        description: `Fund request approved via ${request.paymentMethod}`,
        referenceId: request.transactionId,
        paymentMethod: request.paymentMethod,
        status: "success",
      });

      alert('Fund request approved! Wallet credited successfully.');
      reloadWallets();
      reloadFundRequests();
    } catch (error) {
      console.error('Error approving fund request:', error);
      alert('Error approving fund request. Please try again.');
    }
  };

  const handleRejectFundRequest = async (request: FundRequest, notes: string) => {
    try {
      await updateFundRequest(request.id, {
        status: "rejected",
        approvedBy: userName,
        approvedAt: new Date().toISOString(),
        adminNotes: notes || "Request rejected",
      });

      alert('Fund request rejected.');
      reloadFundRequests();
    } catch (error) {
      console.error('Error rejecting fund request:', error);
      alert('Error rejecting fund request. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Low Balance Alert */}
      {showLowBalanceAlert && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-yellow-900">Low Wallet Balance</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Your wallet balance (₹{userWallet?.balance.toFixed(2)}) is below the threshold (₹{userWallet?.lowBalanceThreshold}). 
              Please add funds to continue transactions.
            </p>
            <button
              onClick={() => setShowFundRequestForm(true)}
              className="mt-2 text-sm font-medium text-yellow-900 hover:text-yellow-800 underline"
            >
              Add Funds Now
            </button>
          </div>
        </div>
      )}

      {/* Wallet Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Wallet size={24} />
            <span className="text-xs opacity-80">Current Balance</span>
          </div>
          <div className="text-3xl font-bold">₹{userWallet?.balance.toFixed(2) || "0.00"}</div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="text-green-600" size={20} />
            <span className="text-xs text-gray-500">Total Funded</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">₹{userWallet?.totalFunded.toFixed(2) || "0.00"}</div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="text-purple-600" size={20} />
            <span className="text-xs text-gray-500">Commission Earned</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">₹{userWallet?.totalCommission.toFixed(2) || "0.00"}</div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="text-red-600" size={20} />
            <span className="text-xs text-gray-500">Total Spent</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">₹{userWallet?.totalSpent.toFixed(2) || "0.00"}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("wallet")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "wallet"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Wallet Details
            </button>
            <button
              onClick={() => setActiveTab("fund")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "fund"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Fund Requests
              {!isAdmin && userFundRequests.filter((fr) => fr.status === "pending").length > 0 && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                  {userFundRequests.filter((fr) => fr.status === "pending").length}
                </span>
              )}
              {isAdmin && allPendingRequests.length > 0 && (
                <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                  {allPendingRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "history"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Transaction History
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Wallet Details Tab */}
          {activeTab === "wallet" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Wallet Information</h3>
                {!isAdmin && (
                  <button
                    onClick={() => setShowFundRequestForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Funds
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Wallet Status</p>
                  <p className="text-lg font-semibold capitalize text-gray-900">{userWallet?.status || "Active"}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Low Balance Alert</p>
                  <p className="text-lg font-semibold text-gray-900">₹{userWallet?.lowBalanceThreshold || 100}</p>
                </div>
              </div>

              {showFundRequestForm && (
                <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Submit Fund Request</h4>
                  <form onSubmit={handleSubmitFundRequest} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                        <select
                          value={formData.paymentMethod}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="NEFT">NEFT</option>
                          <option value="RTGS">RTGS</option>
                          <option value="IMPS">IMPS</option>
                          <option value="UPI">UPI</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                      <input
                        type="text"
                        value={formData.transactionId}
                        onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter bank transaction ID"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={formData.bankName}
                          onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., HDFC Bank"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number (Last 4 digits)</label>
                        <input
                          type="text"
                          value={formData.accountNumber}
                          onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., XXXX1234"
                          maxLength={8}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Submit Request
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowFundRequestForm(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Fund Requests Tab */}
          {activeTab === "fund" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {isAdmin ? "All Fund Requests" : "My Fund Requests"}
              </h3>

              <div className="space-y-3">
                {(isAdmin ? fundRequests : userFundRequests).length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No fund requests found</p>
                ) : (
                  (isAdmin ? fundRequests : userFundRequests).map((request) => (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">₹{request.amount.toFixed(2)}</h4>
                          <p className="text-sm text-gray-600">{request.userName} ({request.userRole})</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            request.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {request.status === "pending" && <Clock size={12} className="inline mr-1" />}
                          {request.status === "approved" && <CheckCircle size={12} className="inline mr-1" />}
                          {request.status === "rejected" && <XCircle size={12} className="inline mr-1" />}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                        <div>
                          <p className="text-gray-600">Method</p>
                          <p className="font-medium text-gray-900 flex items-center gap-1">
                            <CreditCard size={14} />
                            {request.paymentMethod}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Transaction ID</p>
                          <p className="font-medium text-gray-900">{request.transactionId}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Bank</p>
                          <p className="font-medium text-gray-900">{request.bankName || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Account</p>
                          <p className="font-medium text-gray-900">{request.accountNumber || "N/A"}</p>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mb-3">
                        Requested on {new Date(request.created_at).toLocaleString()}
                      </div>

                      {request.status === "pending" && isAdmin && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveFundRequest(request)}
                            className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              const notes = prompt("Enter rejection reason:");
                              if (notes) handleRejectFundRequest(request, notes);
                            }}
                            className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {request.adminNotes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                          <p className="text-gray-600">Admin Notes:</p>
                          <p className="text-gray-900">{request.adminNotes}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Transaction History Tab */}
          {activeTab === "history" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>

              <div className="space-y-2">
                {userTransactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No transactions found</p>
                ) : (
                  userTransactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {txn.type === "credit" ? (
                              <TrendingUp className="text-green-600" size={16} />
                            ) : (
                              <TrendingDown className="text-red-600" size={16} />
                            )}
                            <h4 className="font-semibold text-gray-900">{txn.description}</h4>
                          </div>
                          <p className="text-sm text-gray-600">
                            {txn.transactionId} • {txn.category.replace("_", " ")}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(txn.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right space-y-2">
                          <div>
                            <p
                              className={`text-lg font-bold ${
                                txn.type === "credit" ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {txn.type === "credit" ? "+" : "-"}₹{txn.amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">Balance: ₹{txn.balanceAfter.toFixed(2)}</p>
                          </div>
                          <ReceiptGenerator transaction={txn} />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
