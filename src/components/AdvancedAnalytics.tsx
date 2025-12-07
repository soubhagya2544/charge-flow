import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Download, BarChart3 } from 'lucide-react';

export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState('30');

  const analyticsData = {
    revenue: {
      total: '₹45,23,450',
      growth: '+23.5%',
      trend: 'up'
    },
    transactions: {
      total: '12,450',
      growth: '+18.2%',
      trend: 'up'
    },
    avgValue: {
      total: '₹363.50',
      growth: '+4.1%',
      trend: 'up'
    },
    successRate: {
      total: '98.7%',
      growth: '+1.2%',
      trend: 'up'
    }
  };

  const operatorStats = [
    { operator: 'Jio', transactions: 3250, revenue: '₹12,34,560', percentage: 28 },
    { operator: 'Airtel', transactions: 2890, revenue: '₹10,98,450', percentage: 24 },
    { operator: 'Vodafone', transactions: 2150, revenue: '₹8,23,450', percentage: 18 },
    { operator: 'BSNL', transactions: 1560, revenue: '₹5,67,890', percentage: 13 },
    { operator: 'Others', transactions: 2600, revenue: '₹8,99,100', percentage: 17 }
  ];

  const revenueByType = [
    { type: 'Mobile Recharge', value: 34, revenue: '₹15,45,600' },
    { type: 'DTH Services', value: 28, revenue: '₹12,67,890' },
    { type: 'Data Plans', value: 22, revenue: '₹9,98,450' },
    { type: 'Others', value: 16, revenue: '₹7,11,510' }
  ];

  const handleExport = (format: string) => {
    alert(`Exporting analytics as ${format.toUpperCase()}...`);
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            <Download size={16} className="mr-2" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
            <Download size={16} className="mr-2" />
            CSV
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {['7', '30', '90', '365'].map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'outline'}
            onClick={() => setTimeRange(range)}
            className={timeRange === range ? 'bg-blue-600' : ''}
          >
            Last {range === '365' ? '1Y' : range + 'D'}
          </Button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(analyticsData).map(([key, data]) => (
          <Card key={key} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 capitalize">
                {key === 'revenue' && 'Total Revenue'}
                {key === 'transactions' && 'Transactions'}
                {key === 'avgValue' && 'Avg Transaction'}
                {key === 'successRate' && 'Success Rate'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">{data.total}</div>
              <div className="flex items-center text-green-600 text-sm font-semibold">
                <TrendingUp size={16} className="mr-1" />
                {data.growth}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Operator</CardTitle>
          <CardDescription>Performance across telecom operators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {operatorStats.map((stat) => (
              <div key={stat.operator} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">{stat.operator}</p>
                    <p className="text-sm text-gray-600">{stat.transactions} transactions</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{stat.revenue}</p>
                    <p className="text-sm text-blue-600">{stat.percentage}% of total</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue by Type */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Distribution by Type</CardTitle>
          <CardDescription>Service category breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {revenueByType.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                      {item.value}%
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-900">{item.type}</p>
                    <p className="text-sm text-gray-600">{item.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg w-full">
                <BarChart3 size={48} className="mx-auto text-blue-600 mb-4" />
                <p className="font-semibold text-gray-900">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">₹45,23,450</p>
                <p className="text-sm text-gray-600 mt-2">Last {timeRange} days</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Peak Transaction Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">8:00 PM</p>
            <p className="text-sm text-gray-600 mt-2">Highest activity period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Avg Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">45 seconds</p>
            <p className="text-sm text-gray-600 mt-2">For support tickets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">4.8/5.0</p>
            <p className="text-sm text-gray-600 mt-2">Average rating</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
