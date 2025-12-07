import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calendar, Download, TrendingUp, DollarSign, Activity, BarChart3 } from "lucide-react";

export default function TransactionReports() {
  const [reportType, setReportType] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const reportStats = [
    { title: "Total Transactions", value: "12,456", icon: Activity, color: "text-blue-600" },
    { title: "Total Volume", value: "₹24,56,789", icon: DollarSign, color: "text-green-600" },
    { title: "Commission Earned", value: "₹45,678", icon: TrendingUp, color: "text-purple-600" },
    { title: "Success Rate", value: "98.5%", icon: BarChart3, color: "text-orange-600" },
  ];

  const mockTransactions = [
    { date: "2024-12-06", type: "Recharge", count: 245, volume: "₹45,678", commission: "₹1,234" },
    { date: "2024-12-05", type: "DTH", count: 189, volume: "₹34,567", commission: "₹987" },
    { date: "2024-12-04", type: "Electricity", count: 312, volume: "₹67,890", commission: "₹2,145" },
    { date: "2024-12-03", type: "Water", count: 156, volume: "₹23,456", commission: "₹789" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transaction Reports & Analytics</CardTitle>
          <CardDescription>Generate detailed reports with business predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Report</SelectItem>
                  <SelectItem value="monthly">Monthly Report</SelectItem>
                  <SelectItem value="yearly">Yearly Report</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {reportStats.map((stat, index) => (
              <Card key={index} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Transaction Summary</h3>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Service Type</th>
                    <th className="text-right py-3 px-4">Transactions</th>
                    <th className="text-right py-3 px-4">Volume</th>
                    <th className="text-right py-3 px-4">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTransactions.map((txn, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{txn.date}</td>
                      <td className="py-3 px-4">{txn.type}</td>
                      <td className="py-3 px-4 text-right">{txn.count}</td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">
                        {txn.volume}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-purple-600">
                        {txn.commission}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Predictions & Insights</CardTitle>
          <CardDescription>AI-powered business analytics and forecasting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Revenue Forecast</h4>
                <p className="text-2xl font-bold text-blue-700">₹12.5 Lakhs</p>
                <p className="text-sm text-blue-600 mt-1">Expected next month</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Growth Rate</h4>
                <p className="text-2xl font-bold text-green-700">+18.5%</p>
                <p className="text-sm text-green-600 mt-1">Month over month</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">User Acquisition</h4>
                <p className="text-2xl font-bold text-purple-700">+245</p>
                <p className="text-sm text-purple-600 mt-1">New users this month</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
