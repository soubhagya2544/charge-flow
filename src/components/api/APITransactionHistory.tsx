import { useState, useMemo } from 'react';
import { useEntity } from '../../hooks/useEntity';
import { transactionEntityConfig } from '../../entities';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Calendar,
  DollarSign,
  Hash,
  FileText,
  TrendingUp,
  Activity,
  BarChart3,
  Zap
} from 'lucide-react';

type Transaction = {
  id: number;
  userId: number;
  serviceType: string;
  operator: string;
  accountNumber: string;
  amount: number;
  commission: number;
  status: 'success' | 'failed' | 'pending';
  transactionId: string;
  apiProvider: string;
  responseCode: string;
  responseMessage: string;
  created_at: string;
  updated_at: string;
};

export default function APITransactionHistory() {
  const { items: transactions, loading, error } = useEntity<Transaction>(transactionEntityConfig);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed' | 'pending'>('all');
  const [filterService, setFilterService] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'analytics'>('table');
  const itemsPerPage = 15;

  // Get unique service types
  const serviceTypes = useMemo(() => {
    const types = new Set(transactions.map(t => t.serviceType));
    return Array.from(types);
  }, [transactions]);

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      if (filterStatus !== 'all' && transaction.status !== filterStatus) return false;
      if (filterService !== 'all' && transaction.serviceType !== filterService) return false;
      if (dateRange.start && new Date(transaction.created_at) < new Date(dateRange.start)) return false;
      if (dateRange.end && new Date(transaction.created_at) > new Date(dateRange.end)) return false;
      
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          transaction.transactionId.toLowerCase().includes(search) ||
          transaction.accountNumber.toLowerCase().includes(search) ||
          transaction.operator.toLowerCase().includes(search) ||
          transaction.serviceType.toLowerCase().includes(search) ||
          transaction.apiProvider.toLowerCase().includes(search)
        );
      }
      
      return true;
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [transactions, filterStatus, filterService, dateRange, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    const successful = filteredTransactions.filter(t => t.status === 'success').length;
    const failed = filteredTransactions.filter(t => t.status === 'failed').length;
    const pending = filteredTransactions.filter(t => t.status === 'pending').length;
    const totalCommission = filteredTransactions
      .filter(t => t.status === 'success')
      .reduce((sum, t) => sum + t.commission, 0);
    const successRate = filteredTransactions.length > 0 
      ? ((successful / filteredTransactions.length) * 100).toFixed(2)
      : '0.00';
    
    // Service breakdown
    const serviceBreakdown = serviceTypes.map(service => {
      const serviceTxns = filteredTransactions.filter(t => t.serviceType === service);
      const serviceAmount = serviceTxns.reduce((sum, t) => sum + t.amount, 0);
      const serviceSuccess = serviceTxns.filter(t => t.status === 'success').length;
      return {
        service,
        count: serviceTxns.length,
        amount: serviceAmount,
        successRate: serviceTxns.length > 0 ? ((serviceSuccess / serviceTxns.length) * 100).toFixed(1) : '0'
      };
    }).sort((a, b) => b.amount - a.amount);

    // API Provider breakdown
    const apiProviders = new Set(filteredTransactions.map(t => t.apiProvider));
    const providerBreakdown = Array.from(apiProviders).map(provider => {
      const providerTxns = filteredTransactions.filter(t => t.apiProvider === provider);
      const providerSuccess = providerTxns.filter(t => t.status === 'success').length;
      return {
        provider,
        count: providerTxns.length,
        successRate: providerTxns.length > 0 ? ((providerSuccess / providerTxns.length) * 100).toFixed(1) : '0'
      };
    });
    
    return { total, successful, failed, pending, totalCommission, successRate, serviceBreakdown, providerBreakdown };
  }, [filteredTransactions, serviceTypes]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'failed': return <XCircle className="w-5 h-5" />;
      case 'pending': return <Clock className="w-5 h-5" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Service Type', 'Operator', 'Account Number', 'Amount', 'Commission', 'Status', 'API Provider', 'Response Code'];
    const rows = filteredTransactions.map(t => [
      t.transactionId,
      formatDate(t.created_at),
      t.serviceType,
      t.operator,
      t.accountNumber,
      t.amount,
      t.commission,
      t.status,
      t.apiProvider,
      t.responseCode
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading API transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Transactions</h2>
          <p className="text-gray-600">{String(error)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">API Transaction History</h1>
            <p className="text-gray-600">Monitor all API-driven transactions and analytics</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                viewMode === 'table'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              Table View
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                viewMode === 'analytics'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-5 h-5 inline mr-2" />
              Analytics
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold text-gray-800">₹{stats.total.toFixed(2)}</p>
              </div>
              <DollarSign className="w-10 h-10 text-purple-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-green-600">{stats.successful}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <XCircle className="w-10 h-10 text-red-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-blue-600">{stats.successRate}%</p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Commission</p>
                <p className="text-2xl font-bold text-indigo-600">₹{stats.totalCommission.toFixed(2)}</p>
              </div>
              <Zap className="w-10 h-10 text-indigo-500 opacity-20" />
            </div>
          </div>
        </div>

        {viewMode === 'analytics' ? (
          /* Analytics View */
          <div className="space-y-6">
            {/* Service Breakdown */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-purple-600" />
                Service Type Analytics
              </h3>
              <div className="space-y-4">
                {stats.serviceBreakdown.map((service) => (
                  <div key={service.service} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{service.service}</h4>
                      <span className="text-sm font-medium text-gray-600">{service.count} transactions</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-2">
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-lg font-bold text-purple-600">₹{service.amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Success Rate</p>
                        <p className="text-lg font-bold text-green-600">{service.successRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Avg Amount</p>
                        <p className="text-lg font-bold text-blue-600">
                          ₹{service.count > 0 ? (service.amount / service.count).toFixed(2) : '0.00'}
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${service.successRate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* API Provider Breakdown */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-blue-600" />
                API Provider Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.providerBreakdown.map((provider) => (
                  <div key={provider.provider} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">{provider.provider}</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Transactions</p>
                        <p className="text-2xl font-bold text-gray-800">{provider.count}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Success Rate</p>
                        <p className="text-2xl font-bold text-green-600">{provider.successRate}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${provider.successRate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Table View */
          <>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Search className="w-4 h-4 inline mr-1" />
                    Search
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Transaction ID, Account, API Provider..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Filter className="w-4 h-4 inline mr-1" />
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                {/* Service Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Activity className="w-4 h-4 inline mr-1" />
                    Service Type
                  </label>
                  <select
                    value={filterService}
                    onChange={(e) => setFilterService(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Services</option>
                    {serviceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Export Button */}
                <div className="flex items-end">
                  <button
                    onClick={exportToCSV}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Transactions List */}
            {currentTransactions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Transactions Found</h3>
                <p className="text-gray-600">
                  {searchTerm || filterStatus !== 'all' || filterService !== 'all' || dateRange.start || dateRange.end
                    ? 'Try adjusting your filters to see more results'
                    : 'No API transactions yet. Start integrating to see data here.'}
                </p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Transaction ID
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Service
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            API Provider
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Account
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Commission
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {currentTransactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-purple-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-mono text-gray-900">{transaction.transactionId}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {formatDate(transaction.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-900">{transaction.serviceType}</span>
                              <p className="text-xs text-gray-500">{transaction.operator}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                                <Zap className="w-3 h-3" />
                                {transaction.apiProvider}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                              {transaction.accountNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-semibold text-gray-900">₹{transaction.amount.toFixed(2)}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-semibold text-green-600">₹{transaction.commission.toFixed(2)}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                                {getStatusIcon(transaction.status)}
                                {transaction.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => setSelectedTransaction(transaction)}
                                className="text-purple-600 hover:text-purple-800 transition-colors duration-200"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let page;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                                currentPage === page
                                  ? 'bg-purple-600 text-white'
                                  : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-xl">
                <h2 className="text-2xl font-bold mb-2">API Transaction Details</h2>
                <p className="text-purple-100">Complete information about this API transaction</p>
              </div>

              <div className="p-6">
                {/* Status Badge */}
                <div className="mb-6 text-center">
                  <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold ${getStatusColor(selectedTransaction.status)}`}>
                    {getStatusIcon(selectedTransaction.status)}
                    {selectedTransaction.status.toUpperCase()}
                  </span>
                </div>

                {/* Transaction Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                    <p className="text-lg font-mono font-semibold text-gray-900">{selectedTransaction.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                    <p className="text-lg font-semibold text-gray-900">{formatDate(selectedTransaction.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Service Type</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedTransaction.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Operator</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedTransaction.operator}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Account Number</p>
                    <p className="text-lg font-mono font-semibold text-gray-900">{selectedTransaction.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">API Provider</p>
                    <p className="text-lg font-semibold text-purple-600">{selectedTransaction.apiProvider}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Amount</p>
                    <p className="text-2xl font-bold text-green-600">₹{selectedTransaction.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Commission Earned</p>
                    <p className="text-2xl font-bold text-purple-600">₹{selectedTransaction.commission.toFixed(2)}</p>
                  </div>
                </div>

                {/* API Response Details */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    API Response Details
                  </h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Response Code</p>
                        <p className="font-mono text-sm font-semibold text-gray-900">{selectedTransaction.responseCode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">User ID</p>
                        <p className="font-mono text-sm font-semibold text-gray-900">{selectedTransaction.userId}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Response Message</p>
                      <p className="text-sm text-gray-900 bg-white rounded p-2 mt-1">{selectedTransaction.responseMessage}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-semibold"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors duration-200 font-semibold flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Print Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
