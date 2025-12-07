import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Users, DollarSign, TrendingUp, Activity, 
  Settings, FileText, CreditCard, Bell, Package, 
  UserPlus, Zap, BarChart3, Shield 
} from "lucide-react";
import { Button } from "../ui/button";
import ApiManagement from "./ApiManagement";
import UserManagement from "./UserManagement";
import CommissionSettings from "./CommissionSettings";
import TransactionReports from "./TransactionReports";
import KYCManagement from "./KYCManagement";
import FundOrderManagement from "./FundOrderManagement";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { title: "Total Users", value: "1,234", change: "+12.5%", icon: Users, color: "text-blue-600" },
    { title: "Today's Revenue", value: "₹45,678", change: "+8.2%", icon: DollarSign, color: "text-green-600" },
    { title: "Total Transactions", value: "8,456", change: "+15.3%", icon: TrendingUp, color: "text-purple-600" },
    { title: "Success Rate", value: "98.5%", change: "+1.2%", icon: Activity, color: "text-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <p className="text-sm text-gray-600">Charge Flow Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600 mt-1">{stat.change} from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="apis">APIs</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="commission">Commission</TabsTrigger>
            <TabsTrigger value="kyc">KYC</TabsTrigger>
            <TabsTrigger value="funds">Funds</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest 5 transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Mobile Recharge</p>
                          <p className="text-sm text-gray-600">9876543210</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">₹299</p>
                          <p className="text-xs text-gray-500">2 mins ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Frequently used actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <UserPlus className="w-5 h-5" />
                      <span className="text-sm">Add User</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Package className="w-5 h-5" />
                      <span className="text-sm">Add Package</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Shield className="w-5 h-5" />
                      <span className="text-sm">KYC Review</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <BarChart3 className="w-5 h-5" />
                      <span className="text-sm">Generate Report</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="apis">
            <ApiManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="commission">
            <CommissionSettings />
          </TabsContent>

          <TabsContent value="kyc">
            <KYCManagement />
          </TabsContent>

          <TabsContent value="funds">
            <FundOrderManagement />
          </TabsContent>

          <TabsContent value="reports">
            <TransactionReports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
