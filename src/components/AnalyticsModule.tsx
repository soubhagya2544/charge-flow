import { useState, useMemo, useEffect } from "react";
import { useEntity } from "../hooks/useEntity";
import { rechargeEntityConfig } from "../entities/Recharge";
import { busBookingEntityConfig } from "../entities/BusBooking";
import { walletTransactionEntityConfig } from "../entities/WalletTransaction";
import { telecomOperatorEntityConfig } from "../entities/TelecomOperator";
import { reportEntityConfig } from "../entities/Report";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Download,
  Filter,
  Calendar,
  PieChart,
  Activity,
  Zap,
} from "lucide-react";

type Recharge = {
  id: number;
  operator: string;
  operatorCode: string;
  amount: number;
  status: string;
  userEmail: string;
  created_at: string;
};

type BusBooking = {
  id: number;
  amount: number;
  status: string;
  userEmail: string;
  apiProvider: string;
  created_at: string;
};

type WalletTransaction = {
  id: number;
  userEmail: string;
  amount: number;
  type: "credit" | "debit";
  category: string;
  created_at: string;
};

type Operator = {
  id: number;
  name: string;
  operatorCode: string;
  type: string;
  incomingCommission: number;
  outgoingCommission: number;
};

type Report = {
  id: number;
  reportType: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  filters: string;
  data: string;
  generatedBy: string;
  format: string;
  status: string;
  created_at: string;
};

interface AnalyticsModuleProps {
  userEmail: string;
  userRole: string;
}

export default function AnalyticsModule({
  userEmail,
  userRole,
}: AnalyticsModuleProps) {
  const { items: recharges } = useEntity<Recharge>(rechargeEntityConfig);
  const { items: bookings } = useEntity<BusBooking>(busBookingEntityConfig);
  const { items: transactions } = useEntity<WalletTransaction>(
    walletTransactionEntityConfig
  );
  const { items: operators } = useEntity<Operator>(telecomOperatorEntityConfig);
  const {
    items: reports,
    create: createReport,
    loading: reportsLoading,
  } = useEntity<Report>(reportEntityConfig);

  const [activeTab, setActiveTab] = useState<
    "overview" | "operators" | "users" | "custom"
  >("overview");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [selectedOperator, setSelectedOperator] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [reportType, setReportType] = useState<string>("transaction_volume");

  // Filter data by date range
  const filteredRecharges = useMemo(() => {
    return recharges.filter((r) => {
      const date = new Date(r.created_at);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);

      const dateMatch = date >= start && date <= end;
      const operatorMatch =
        selectedOperator === "all" || r.operatorCode === selectedOperator;
      const statusMatch = selectedStatus === "all" || r.status === selectedStatus;

      return dateMatch && operatorMatch && statusMatch;
    });
  }, [recharges, dateRange, selectedOperator, selectedStatus]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const date = new Date(b.created_at);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);

      const dateMatch = date >= start && date <= end;
      const statusMatch = selectedStatus === "all" || b.status === selectedStatus;

      return dateMatch && statusMatch;
    });
  }, [bookings, dateRange, selectedStatus]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const date = new Date(t.created_at);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);

      return date >= start && date <= end;
    });
  }, [transactions, dateRange]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalRecharges = filteredRecharges.length;
    const successfulRecharges = filteredRecharges.filter(
      (r) => r.status === "success"
    ).length;
    const rechargeRevenue = filteredRecharges
      .filter((r) => r.status === "success")
      .reduce((sum, r) => sum + r.amount, 0);

    const totalBookings = filteredBookings.length;
    const confirmedBookings = filteredBookings.filter(
      (b) => b.status === "confirmed"
    ).length;
    const bookingRevenue = filteredBookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + b.amount, 0);

    const totalRevenue = rechargeRevenue + bookingRevenue;

    const uniqueUsers = new Set([
      ...filteredRecharges.map((r) => r.userEmail),
      ...filteredBookings.map((b) => b.userEmail),
    ]).size;

    const totalCommission = filteredTransactions
      .filter((t) => t.category === "commission" && t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalRecharges,
      successfulRecharges,
      rechargeRevenue,
      totalBookings,
      confirmedBookings,
      bookingRevenue,
      totalRevenue,
      uniqueUsers,
      totalCommission,
      successRate:
        totalRecharges > 0
          ? ((successfulRecharges / totalRecharges) * 100).toFixed(1)
          : "0",
    };
  }, [filteredRecharges, filteredBookings, filteredTransactions]);

  // Operator-wise revenue
  const operatorRevenue = useMemo(() => {
    const revenueMap = new Map<string, { revenue: number; count: number }>();

    filteredRecharges
      .filter((r) => r.status === "success")
      .forEach((r) => {
        const existing = revenueMap.get(r.operator) || { revenue: 0, count: 0 };
        revenueMap.set(r.operator, {
          revenue: existing.revenue + r.amount,
          count: existing.count + 1,
        });
      });

    return Array.from(revenueMap.entries())
      .map(([operator, data]) => ({
        operator,
        revenue: data.revenue,
        count: data.count,
        percentage: ((data.revenue / metrics.rechargeRevenue) * 100).toFixed(1),
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredRecharges, metrics.rechargeRevenue]);

  // Daily transaction volume
  const dailyVolume = useMemo(() => {
    const volumeMap = new Map<string, { recharges: number; bookings: number }>();

    filteredRecharges.forEach((r) => {
      const date = new Date(r.created_at).toISOString().split("T")[0];
      const existing = volumeMap.get(date) || { recharges: 0, bookings: 0 };
      volumeMap.set(date, {
        ...existing,
        recharges: existing.recharges + 1,
      });
    });

    filteredBookings.forEach((b) => {
      const date = new Date(b.created_at).toISOString().split("T")[0];
      const existing = volumeMap.get(date) || { recharges: 0, bookings: 0 };
      volumeMap.set(date, {
        ...existing,
        bookings: existing.bookings + 1,
      });
    });

    return Array.from(volumeMap.entries())
      .map(([date, data]) => ({
        date,
        recharges: data.recharges,
        bookings: data.bookings,
        total: data.recharges + data.bookings,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredRecharges, filteredBookings]);

  // User activity
  const userActivity = useMemo(() => {
    const activityMap = new Map<
      string,
      { recharges: number; bookings: number; spent: number }
    >();

    filteredRecharges
      .filter((r) => r.status === "success")
      .forEach((r) => {
        const existing = activityMap.get(r.userEmail) || {
          recharges: 0,
          bookings: 0,
          spent: 0,
        };
        activityMap.set(r.userEmail, {
          ...existing,
          recharges: existing.recharges + 1,
          spent: existing.spent + r.amount,
        });
      });

    filteredBookings
      .filter((b) => b.status === "confirmed")
      .forEach((b) => {
        const existing = activityMap.get(b.userEmail) || {
          recharges: 0,
          bookings: 0,
          spent: 0,
        };
        activityMap.set(b.userEmail, {
          ...existing,
          bookings: existing.bookings + 1,
          spent: existing.spent + b.amount,
        });
      });

    return Array.from(activityMap.entries())
      .map(([email, data]) => ({
        email,
        recharges: data.recharges,
        bookings: data.bookings,
        totalTransactions: data.recharges + data.bookings,
        totalSpent: data.spent,
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);
  }, [filteredRecharges, filteredBookings]);

  // Export to CSV
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((header) => JSON.stringify(row[header] || "")).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  // Export to PDF (text-based)
  const exportToPDF = (content: string, filename: string) => {
    const pdfContent = `
CHARGE FLOW - ANALYTICS REPORT
===============================

Generated: ${new Date().toLocaleString()}
Date Range: ${dateRange.startDate} to ${dateRange.endDate}
Generated By: ${userEmail}

${content}

---
This is an automated report from Charge Flow platform.
    `.trim();

    const blob = new Blob([pdfContent], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split("T")[0]}.txt`;
    link.click();
  };

  // Generate and save report
  const generateReport = async () => {
    let reportData = {};
    let reportTitle = "";
    let reportDescription = "";

    switch (reportType) {
      case "transaction_volume":
        reportData = { dailyVolume, metrics };
        reportTitle = "Transaction Volume Report";
        reportDescription = `Daily transaction volumes from ${dateRange.startDate} to ${dateRange.endDate}`;
        break;
      case "revenue_by_operator":
        reportData = { operatorRevenue, totalRevenue: metrics.rechargeRevenue };
        reportTitle = "Revenue by Operator Report";
        reportDescription = `Operator-wise revenue breakdown`;
        break;
      case "user_activity":
        reportData = { userActivity, totalUsers: metrics.uniqueUsers };
        reportTitle = "User Activity Report";
        reportDescription = `Top users by transaction volume and spending`;
        break;
      case "commission_summary":
        reportData = { totalCommission: metrics.totalCommission, transactions: filteredTransactions };
        reportTitle = "Commission Summary Report";
        reportDescription = `Commission earnings summary`;
        break;
      default:
        reportData = { metrics, operatorRevenue, userActivity, dailyVolume };
        reportTitle = "Custom Analytics Report";
        reportDescription = "Comprehensive analytics report";
    }

    await createReport({
      reportType,
      title: reportTitle,
      description: reportDescription,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      filters: JSON.stringify({
        operator: selectedOperator,
        status: selectedStatus,
      }),
      data: JSON.stringify(reportData),
      generatedBy: userEmail,
      format: "json",
      status: "generated",
    });

    alert("Report generated and saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="w-8 h-8" />
              Analytics & Reports
            </h2>
            <p className="mt-1 opacity-90">
              Advanced reporting with data visualization and insights
            </p>
          </div>
          <Activity className="w-16 h-16 opacity-20" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, startDate: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, endDate: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Operator
            </label>
            <select
              value={selectedOperator}
              onChange={(e) => setSelectedOperator(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Operators</option>
              {operators.map((op) => (
                <option key={op.id} value={op.operatorCode}>
                  {op.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold mt-1">
                ₹{metrics.totalRevenue.toLocaleString()}
              </p>
              <p className="text-blue-100 text-xs mt-1">
                Recharge: ₹{metrics.rechargeRevenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-12 h-12 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Transactions</p>
              <p className="text-3xl font-bold mt-1">
                {metrics.totalRecharges + metrics.totalBookings}
              </p>
              <p className="text-green-100 text-xs mt-1">
                Success Rate: {metrics.successRate}%
              </p>
            </div>
            <TrendingUp className="w-12 h-12 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Active Users</p>
              <p className="text-3xl font-bold mt-1">{metrics.uniqueUsers}</p>
              <p className="text-purple-100 text-xs mt-1">
                Avg: ₹
                {metrics.uniqueUsers > 0
                  ? (metrics.totalRevenue / metrics.uniqueUsers).toFixed(0)
                  : 0}
                /user
              </p>
            </div>
            <Users className="w-12 h-12 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Commission</p>
              <p className="text-3xl font-bold mt-1">
                ₹{metrics.totalCommission.toLocaleString()}
              </p>
              <p className="text-orange-100 text-xs mt-1">
                From {filteredTransactions.filter(t => t.category === 'commission').length} transactions
              </p>
            </div>
            <Zap className="w-12 h-12 opacity-20" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <div className="flex gap-4 px-6">
            {[
              { key: "overview", label: "Overview", icon: BarChart3 },
              { key: "operators", label: "By Operator", icon: PieChart },
              { key: "users", label: "User Activity", icon: Users },
              { key: "custom", label: "Custom Report", icon: Download },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Daily Transaction Volume
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="overflow-x-auto">
                    <div className="flex items-end gap-2 min-w-max h-48">
                      {dailyVolume.map((day) => {
                        const maxTotal = Math.max(...dailyVolume.map((d) => d.total));
                        const height = (day.total / maxTotal) * 100;
                        return (
                          <div key={day.date} className="flex flex-col items-center gap-1">
                            <div className="flex flex-col items-center gap-1">
                              <div
                                className="w-12 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t hover:from-purple-700 hover:to-purple-500 transition-all cursor-pointer group relative"
                                style={{ height: `${height}%` }}
                              >
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  {day.total} transactions
                                </div>
                              </div>
                              <div className="text-xs text-gray-600 transform -rotate-45 origin-top-left whitespace-nowrap">
                                {new Date(day.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-600 rounded"></div>
                      <span className="text-gray-600">Total Transactions</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => exportToCSV(dailyVolume, "daily_volume")}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  onClick={() =>
                    exportToPDF(
                      `DAILY TRANSACTION VOLUME\n\n${dailyVolume
                        .map(
                          (d) =>
                            `${d.date}: ${d.recharges} recharges, ${d.bookings} bookings, Total: ${d.total}`
                        )
                        .join("\n")}`,
                      "daily_volume"
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
              </div>
            </div>
          )}

          {activeTab === "operators" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-600" />
                  Revenue by Operator
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Operator
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Transactions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Share
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Visual
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {operatorRevenue.map((op, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {op.operator}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {op.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-green-600">
                              ₹{op.revenue.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">
                              {op.percentage}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ width: `${op.percentage}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => exportToCSV(operatorRevenue, "operator_revenue")}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  onClick={() =>
                    exportToPDF(
                      `REVENUE BY OPERATOR\n\n${operatorRevenue
                        .map(
                          (op) =>
                            `${op.operator}: ₹${op.revenue.toLocaleString()} (${
                              op.count
                            } transactions, ${op.percentage}%)`
                        )
                        .join("\n")}`,
                      "operator_revenue"
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Top Users by Activity
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          User Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Recharges
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Bookings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Total Transactions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Total Spent
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userActivity.map((user, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {user.recharges}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {user.bookings}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                              {user.totalTransactions}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-green-600">
                              ₹{user.totalSpent.toLocaleString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => exportToCSV(userActivity, "user_activity")}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  onClick={() =>
                    exportToPDF(
                      `USER ACTIVITY REPORT\n\n${userActivity
                        .map(
                          (u) =>
                            `${u.email}: ${u.recharges} recharges, ${u.bookings} bookings, ₹${u.totalSpent.toLocaleString()} spent`
                        )
                        .join("\n")}`,
                      "user_activity"
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
              </div>
            </div>
          )}

          {activeTab === "custom" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Generate Custom Report</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Type
                    </label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="transaction_volume">Transaction Volume</option>
                      <option value="revenue_by_operator">Revenue by Operator</option>
                      <option value="user_activity">User Activity Trends</option>
                      <option value="commission_summary">Commission Summary</option>
                      <option value="wallet_analysis">Wallet Analysis</option>
                      <option value="operator_performance">Operator Performance</option>
                      <option value="custom">Custom Report</option>
                    </select>
                  </div>

                  <button
                    onClick={generateReport}
                    disabled={reportsLoading}
                    className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Generate and Save Report
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Saved Reports</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Report Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date Range
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Generated
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reports.slice(0, 10).map((report) => (
                        <tr key={report.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {report.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {report.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {report.reportType.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {report.startDate} to {report.endDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(report.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => {
                                const data = JSON.parse(report.data);
                                exportToCSV(
                                  Array.isArray(data) ? data : [data],
                                  report.title.replace(/\s+/g, "_").toLowerCase()
                                );
                              }}
                              className="text-green-600 hover:text-green-800 mr-3"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
