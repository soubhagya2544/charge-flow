import { lazy, Suspense, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Users, DollarSign, Activity, Phone, Bus, AlertTriangle, Settings } from "lucide-react";
import { useEntity } from "../hooks/useEntity";
import { walletEntityConfig, fundRequestEntityConfig, rechargeEntityConfig, busBookingEntityConfig, complaintEntityConfig } from "../entities";

const ApiManagement = lazy(() => import("../components/admin/ApiManagement"));
const UserManagement = lazy(() => import("../components/admin/UserManagement"));
const CommissionSettings = lazy(() => import("../components/admin/CommissionSettings"));
const TransactionReports = lazy(() => import("../components/admin/TransactionReports"));
const KYCManagement = lazy(() => import("../components/admin/KYCManagement"));
const FundOrderManagement = lazy(() => import("../components/admin/FundOrderManagement"));
const OperatorManagement = lazy(() => import("../components/admin/OperatorManagement"));
const BusAPIManagement = lazy(() => import("../components/admin/BusAPIManagement"));
const LiveMonitoring = lazy(() => import("../components/admin/LiveMonitoring"));
const RechargePlanManagement = lazy(() => import("../components/admin/RechargePlanManagement"));
const AnalyticsModule = lazy(() => import("../components/AnalyticsModule"));
const WalletManager = lazy(() => import("../components/WalletManager"));
const AdminProfileSettings = lazy(() => import("../components/admin/AdminProfileSettings"));

type Wallet = { id: number; userId: string; balance: number; totalFunded: number; commissionEarned: number; totalSpent: number; created_at: string; updated_at: string };
type FundRequest = { id: number; requestId: string; userId: string; userName: string; amount: number; status: string; created_at: string; updated_at: string };
type Recharge = { id: number; status: string; created_at: string };
type BusBooking = { id: number; status: string; created_at: string };
type Complaint = { id: number; status: string; created_at: string };

interface AdminDashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export default function AdminDashboard({ userEmail, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { items: wallets } = useEntity<Wallet>(walletEntityConfig);
  const { items: fundRequests } = useEntity<FundRequest>(fundRequestEntityConfig);
  const { items: recharges } = useEntity<Recharge>(rechargeEntityConfig);
  const { items: bookings } = useEntity<BusBooking>(busBookingEntityConfig);
  const { items: complaints } = useEntity<Complaint>(complaintEntityConfig);

  const pendingFunds = fundRequests.filter(r => r.status === "pending").length;
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
  const todayRecharges = recharges.filter(r => {
    const today = new Date().toDateString();
    return new Date(r.created_at).toDateString() === today;
  }).length;
  const todayBookings = bookings.filter(b => {
    const today = new Date().toDateString();
    return new Date(b.created_at).toDateString() === today;
  }).length;
  const openComplaints = complaints.filter(c => c.status === "open" || c.status === "in_progress").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your Charge Flow platform</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Wallets</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalBalance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{wallets.length} active wallets</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today Recharges</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayRecharges}</div>
              <p className="text-xs text-muted-foreground">{recharges.length} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today Bookings</CardTitle>
              <Bus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayBookings}</div>
              <p className="text-xs text-muted-foreground">{bookings.length} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Complaints</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openComplaints}</div>
              <p className="text-xs text-muted-foreground">{complaints.length} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Funds</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingFunds}</div>
              <p className="text-xs text-muted-foreground">{fundRequests.length} requests</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-12">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="live">Live</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="operators">Operators</TabsTrigger>
            <TabsTrigger value="bus-api">Bus API</TabsTrigger>
            <TabsTrigger value="apis">APIs</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="commission">Commission</TabsTrigger>
            <TabsTrigger value="kyc">KYC</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Recent Activity</h3>
                    <div className="space-y-2 text-sm">
                      <p>✅ {recharges.filter(r => r.status === "success").length} Successful Recharges</p>
                      <p>✅ {bookings.filter(b => b.status === "confirmed").length} Confirmed Bookings</p>
                      <p>⏳ {recharges.filter(r => r.status === "pending").length} Pending Transactions</p>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Financial Summary</h3>
                    <div className="space-y-2 text-sm">
                      <p>💰 Total Balance: ₹{totalBalance.toFixed(2)}</p>
                      <p>💳 Pending Funds: {pendingFunds}</p>
                      <p>📊 Active Wallets: {wallets.length}</p>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Support</h3>
                    <div className="space-y-2 text-sm">
                      <p>🎫 Open Complaints: {openComplaints}</p>
                      <p>✅ Resolved: {complaints.filter(c => c.status === "resolved").length}</p>
                      <p>⚠️ Disputed: {complaints.filter(c => c.status === "disputed").length}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="live">
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <LiveMonitoring />
            </Suspense>
          </TabsContent>

          <TabsContent value="wallet">
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <WalletManager userRole="admin" userName="Admin" userEmail={userEmail} isAdmin={true} />
            </Suspense>
          </TabsContent>

          <TabsContent value="operators">
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <OperatorManagement />
            </Suspense>
          </TabsContent>

          <TabsContent value="bus-api">
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <BusAPIManagement />
            </Suspense>
          </TabsContent>

          <TabsContent value="apis">
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <ApiManagement />
            </Suspense>
          </TabsContent>

          <TabsContent value="users">
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <UserManagement />
            </Suspense>
          </TabsContent>

          <TabsContent value="commission">
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <CommissionSettings />
            </Suspense>
          </TabsContent>

          <TabsContent value="kyc">
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <KYCManagement />
            </Suspense>
          </TabsContent>

          <TabsContent value="reports">
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <TransactionReports />
            </Suspense>
          </TabsContent>

          <TabsContent value="analytics">
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <AnalyticsModule userEmail={userEmail} userRole="admin" />
            </Suspense>
          </TabsContent>

          <TabsContent value="plans">
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <RechargePlanManagement />
            </Suspense>
          </TabsContent>

          <TabsContent value="settings">
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <AdminProfileSettings adminEmail={userEmail} onLogout={onLogout} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
