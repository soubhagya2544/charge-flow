import { useState } from 'react';
import WalletManager from '../components/WalletManager';
import { useEntity } from '../hooks/useEntity';
import { apiKeyEntityConfig } from '../entities/APIKey';
import { apiUsageEntityConfig } from '../entities/APIUsage';
import { Key, Copy, Eye, EyeOff, Plus, Trash2, Code, Activity, Book, Shield, RefreshCw, Download, AlertCircle, History } from 'lucide-react';
import APITransactionHistory from '../components/api/APITransactionHistory';

type APIKey = {
  id: number;
  userId: number;
  keyName: string;
  apiKey: string;
  status: string;
  ipWhitelist: string;
  rateLimit: number;
  expiryDate: string;
  permissions: string;
  created_at: string;
  updated_at: string;
};

type APIUsage = {
  id: number;
  apiKeyId: number;
  endpoint: string;
  requestCount: number;
  successCount: number;
  failureCount: number;
  avgResponseTime: number;
  lastUsed: string;
  created_at: string;
  updated_at: string;
};

type APIUserPanelProps = {
  userEmail: string;
};

export default function APIUserPanel({ userEmail }: APIUserPanelProps) {
  const [activeTab, setActiveTab] = useState<'keys' | 'usage' | 'docs' | 'integration' | 'transactions'>('keys');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showKeyValue, setShowKeyValue] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<number | null>(null);

  const { items: apiKeys, loading: keysLoading, create: createKey, remove: deleteKey } = useEntity<APIKey>(apiKeyEntityConfig);
  const { items: apiUsage, loading: usageLoading } = useEntity<APIUsage>(apiUsageEntityConfig);

  const [newKey, setNewKey] = useState({
    keyName: '',
    ipWhitelist: '',
    rateLimit: 1000,
    expiryDate: '',
    permissions: 'recharge,billpay'
  });

  const generateRandomKey = () => {
    return 'cf_' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleCreateKey = async () => {
    if (!newKey.keyName) {
      alert('Please enter a key name');
      return;
    }

    await createKey({
      userId: 1,
      keyName: newKey.keyName,
      apiKey: generateRandomKey(),
      status: 'active',
      ipWhitelist: newKey.ipWhitelist,
      rateLimit: newKey.rateLimit,
      expiryDate: newKey.expiryDate,
      permissions: newKey.permissions
    });

    setShowCreateModal(false);
    setNewKey({
      keyName: '',
      ipWhitelist: '',
      rateLimit: 1000,
      expiryDate: '',
      permissions: 'recharge,billpay'
    });
  };

  const copyToClipboard = (text: string, keyId: number) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleKeyVisibility = (keyId: number) => {
    setShowKeyValue(showKeyValue === keyId ? null : keyId);
  };

  const getUsageForKey = (keyId: number) => {
    return apiUsage.filter(u => u.apiKeyId === keyId);
  };

  const getTotalRequests = (keyId: number) => {
    return getUsageForKey(keyId).reduce((sum, u) => sum + u.requestCount, 0);
  };

  const getSuccessRate = (keyId: number) => {
    const usage = getUsageForKey(keyId);
    const total = usage.reduce((sum, u) => sum + u.requestCount, 0);
    const success = usage.reduce((sum, u) => sum + u.successCount, 0);
    return total > 0 ? ((success / total) * 100).toFixed(1) : '0';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">API Management</h1>
          <p className="text-gray-600">Manage your API keys, monitor usage, and integrate with Charge Flow services</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('keys')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === 'keys'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Key className="w-5 h-5" />
              API Keys
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === 'usage'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Activity className="w-5 h-5" />
              Usage & Analytics
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === 'docs'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Book className="w-5 h-5" />
              Documentation
            </button>
            <button
              onClick={() => setActiveTab('integration')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === 'integration'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Code className="w-5 h-5" />
              Integration Guide
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === 'transactions'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <History className="w-5 h-5" />
              Transactions
            </button>
          </div>
        </div>

        {/* API Keys Tab */}
        {activeTab === 'keys' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Your API Keys</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Create New Key
              </button>
            </div>

            {keysLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Key className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No API Keys Yet</h3>
                <p className="text-gray-600 mb-6">Create your first API key to start integrating with Charge Flow</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Create Your First Key
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {apiKeys.map((key) => (
                  <div key={key.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{key.keyName}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          key.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {key.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteKey(key.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete API Key"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-50 rounded-lg p-3 font-mono text-sm">
                          {showKeyValue === key.id ? key.apiKey : '••••••••••••••••••••••••••••••••'}
                        </div>
                        <button
                          onClick={() => toggleKeyVisibility(key.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                          title={showKeyValue === key.id ? 'Hide' : 'Show'}
                        >
                          {showKeyValue === key.id ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(key.apiKey, key.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                          title="Copy to clipboard"
                        >
                          <Copy className={`w-5 h-5 ${copiedKey === key.id ? 'text-green-600' : ''}`} />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Total Requests</p>
                          <p className="text-lg font-semibold text-gray-900">{getTotalRequests(key.id).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Success Rate</p>
                          <p className="text-lg font-semibold text-green-600">{getSuccessRate(key.id)}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Rate Limit</p>
                          <p className="text-lg font-semibold text-gray-900">{key.rateLimit}/hr</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Expires</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {key.expiryDate ? new Date(key.expiryDate).toLocaleDateString() : 'Never'}
                          </p>
                        </div>
                      </div>

                      {key.ipWhitelist && (
                        <div className="pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">IP Whitelist</p>
                          <p className="text-sm text-gray-900 font-mono">{key.ipWhitelist}</p>
                        </div>
                      )}

                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Permissions</p>
                        <div className="flex flex-wrap gap-2">
                          {key.permissions.split(',').map((perm) => (
                            <span key={perm} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                              {perm.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Usage & Analytics Tab */}
        {activeTab === 'usage' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">API Usage & Analytics</h2>

            {usageLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <>
                {/* Overview Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600">Total Requests</p>
                      <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {apiUsage.reduce((sum, u) => sum + u.requestCount, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600 mt-2">All time</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600">Success Rate</p>
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">
                      {(() => {
                        const total = apiUsage.reduce((sum, u) => sum + u.requestCount, 0);
                        const success = apiUsage.reduce((sum, u) => sum + u.successCount, 0);
                        return total > 0 ? ((success / total) * 100).toFixed(1) : '0';
                      })()}%
                    </p>
                    <p className="text-sm text-gray-600 mt-2">Overall performance</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600">Avg Response Time</p>
                      <RefreshCw className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {(() => {
                        const avgTimes = apiUsage.map(u => u.avgResponseTime).filter(t => t > 0);
                        return avgTimes.length > 0
                          ? (avgTimes.reduce((sum, t) => sum + t, 0) / avgTimes.length).toFixed(0)
                          : '0';
                      })()}ms
                    </p>
                    <p className="text-sm text-gray-600 mt-2">Average latency</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600">Failed Requests</p>
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <p className="text-3xl font-bold text-red-600">
                      {apiUsage.reduce((sum, u) => sum + u.failureCount, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">Requires attention</p>
                  </div>
                </div>

                {/* Endpoint Usage Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-900">Endpoint Usage</h3>
                      <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Download className="w-4 h-4" />
                        Export Report
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requests</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Failed</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Used</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {apiUsage.map((usage) => (
                          <tr key={usage.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <code className="text-sm font-mono text-blue-600">{usage.endpoint}</code>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {usage.requestCount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                              {usage.successCount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                              {usage.failureCount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {usage.avgResponseTime}ms
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {new Date(usage.lastUsed).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Documentation Tab */}
        {activeTab === 'docs' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">API Documentation</h2>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Base URL</h3>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                https://api.chargeflow.com/v1
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Authentication</h3>
              <p className="text-gray-600 mb-4">All API requests require authentication using your API key in the header:</p>
              <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
                Authorization: Bearer YOUR_API_KEY
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Available Endpoints</h3>
              
              <div className="space-y-6">
                {/* Mobile Recharge */}
                <div className="border-l-4 border-blue-600 pl-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Mobile Recharge</h4>
                  <code className="text-sm bg-gray-50 px-3 py-1 rounded">POST /recharge/mobile</code>
                  <div className="mt-3 bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
{`{
  "mobile": "9876543210",
  "operator": "jio",
  "circle": "delhi",
  "amount": 299,
  "type": "prepaid"
}`}
                  </div>
                </div>

                {/* DTH Recharge */}
                <div className="border-l-4 border-purple-600 pl-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">DTH Recharge</h4>
                  <code className="text-sm bg-gray-50 px-3 py-1 rounded">POST /recharge/dth</code>
                  <div className="mt-3 bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
{`{
  "subscriberId": "1234567890",
  "operator": "tata_sky",
  "amount": 500
}`}
                  </div>
                </div>

                {/* Bill Payment */}
                <div className="border-l-4 border-orange-600 pl-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Bill Payment</h4>
                  <code className="text-sm bg-gray-50 px-3 py-1 rounded">POST /billpay/electricity</code>
                  <div className="mt-3 bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
{`{
  "billerId": "MSEDCL001",
  "accountNumber": "123456789012",
  "amount": 1500,
  "billType": "electricity"
}`}
                  </div>
                </div>

                {/* Check Balance */}
                <div className="border-l-4 border-green-600 pl-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Check Balance</h4>
                  <code className="text-sm bg-gray-50 px-3 py-1 rounded">GET /wallet/balance</code>
                  <div className="mt-3 bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
{`{
  "balance": 50000.00,
  "currency": "INR"
}`}
                  </div>
                </div>

                {/* Transaction Status */}
                <div className="border-l-4 border-red-600 pl-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Transaction Status</h4>
                  <code className="text-sm bg-gray-50 px-3 py-1 rounded">GET /transaction/:transactionId</code>
                  <div className="mt-3 bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
{`{
  "transactionId": "TXN123456789",
  "status": "success",
  "amount": 299,
  "timestamp": "2024-01-15T10:30:00Z"
}`}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Response Codes</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded font-mono text-sm">200</span>
                  <div>
                    <p className="font-semibold text-gray-900">Success</p>
                    <p className="text-sm text-gray-600">Request completed successfully</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded font-mono text-sm">400</span>
                  <div>
                    <p className="font-semibold text-gray-900">Bad Request</p>
                    <p className="text-sm text-gray-600">Invalid parameters or missing required fields</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded font-mono text-sm">401</span>
                  <div>
                    <p className="font-semibold text-gray-900">Unauthorized</p>
                    <p className="text-sm text-gray-600">Invalid or missing API key</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded font-mono text-sm">429</span>
                  <div>
                    <p className="font-semibold text-gray-900">Rate Limit Exceeded</p>
                    <p className="text-sm text-gray-600">Too many requests, please slow down</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded font-mono text-sm">500</span>
                  <div>
                    <p className="font-semibold text-gray-900">Server Error</p>
                    <p className="text-sm text-gray-600">Internal server error, please try again</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Integration Guide Tab */}
        {activeTab === 'integration' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Integration Guide</h2>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Start</h3>
              <ol className="space-y-4 list-decimal list-inside">
                <li className="text-gray-700">
                  <strong>Generate API Key:</strong> Create a new API key from the API Keys tab
                </li>
                <li className="text-gray-700">
                  <strong>Configure IP Whitelist:</strong> Add your server IP addresses for security
                </li>
                <li className="text-gray-700">
                  <strong>Set Permissions:</strong> Choose which services your API key can access
                </li>
                <li className="text-gray-700">
                  <strong>Test Integration:</strong> Use our sandbox environment for testing
                </li>
                <li className="text-gray-700">
                  <strong>Go Live:</strong> Switch to production mode when ready
                </li>
              </ol>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sample Code</h3>
              
              {/* JavaScript */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">JavaScript / Node.js</h4>
                <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
{`const axios = require('axios');

const API_KEY = 'your_api_key_here';
const BASE_URL = 'https://api.chargeflow.com/v1';

async function mobileRecharge(mobile, operator, amount) {
  try {
    const response = await axios.post(
      \`\${BASE_URL}/recharge/mobile\`,
      {
        mobile: mobile,
        operator: operator,
        circle: 'delhi',
        amount: amount,
        type: 'prepaid'
      },
      {
        headers: {
          'Authorization': \`Bearer \${API_KEY}\`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
}

// Usage
mobileRecharge('9876543210', 'jio', 299)
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Failed:', error));`}
                </div>
              </div>

              {/* Python */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Python</h4>
                <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
{`import requests

API_KEY = 'your_api_key_here'
BASE_URL = 'https://api.chargeflow.com/v1'

def mobile_recharge(mobile, operator, amount):
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'mobile': mobile,
        'operator': operator,
        'circle': 'delhi',
        'amount': amount,
        'type': 'prepaid'
    }
    
    response = requests.post(
        f'{BASE_URL}/recharge/mobile',
        json=payload,
        headers=headers
    )
    
    return response.json()

# Usage
result = mobile_recharge('9876543210', 'jio', 299)
print('Success:', result)`}
                </div>
              </div>

              {/* PHP */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">PHP</h4>
                <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
{`<?php

$apiKey = 'your_api_key_here';
$baseUrl = 'https://api.chargeflow.com/v1';

function mobileRecharge($mobile, $operator, $amount) {
    global $apiKey, $baseUrl;
    
    $data = array(
        'mobile' => $mobile,
        'operator' => $operator,
        'circle' => 'delhi',
        'amount' => $amount,
        'type' => 'prepaid'
    );
    
    $ch = curl_init($baseUrl . '/recharge/mobile');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json'
    ));
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

// Usage
$result = mobileRecharge('9876543210', 'jio', 299);
print_r($result);

?>`}
                </div>
              </div>

              {/* cURL */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">cURL</h4>
                <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
{`curl -X POST https://api.chargeflow.com/v1/recharge/mobile \\
  -H "Authorization: Bearer your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "mobile": "9876543210",
    "operator": "jio",
    "circle": "delhi",
    "amount": 299,
    "type": "prepaid"
  }'`}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Webhooks</h3>
              <p className="text-gray-600 mb-4">
                Configure webhooks to receive real-time notifications about transaction status updates:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Webhook URL:</p>
                <input
                  type="text"
                  placeholder="https://your-domain.com/webhook"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
{`// Webhook payload example
{
  "event": "transaction.completed",
  "transactionId": "TXN123456789",
  "status": "success",
  "amount": 299,
  "timestamp": "2024-01-15T10:30:00Z",
  "signature": "sha256_hash_for_verification"
}`}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Best Practices</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Secure Your API Keys</p>
                    <p className="text-sm text-gray-600">Never expose API keys in client-side code or public repositories</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <RefreshCw className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Handle Rate Limits</p>
                    <p className="text-sm text-gray-600">Implement exponential backoff when receiving 429 errors</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Error Handling</p>
                    <p className="text-sm text-gray-600">Always implement proper error handling and retry logic</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Monitor Usage</p>
                    <p className="text-sm text-gray-600">Regularly check your API usage dashboard to track performance</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && <APITransactionHistory />}

        {/* Create API Key Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">Create New API Key</h3>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Name *
                  </label>
                  <input
                    type="text"
                    value={newKey.keyName}
                    onChange={(e) => setNewKey({ ...newKey, keyName: e.target.value })}
                    placeholder="Production Server Key"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IP Whitelist (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newKey.ipWhitelist}
                    onChange={(e) => setNewKey({ ...newKey, ipWhitelist: e.target.value })}
                    placeholder="192.168.1.1, 192.168.1.2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to allow all IPs</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate Limit (requests per hour)
                  </label>
                  <input
                    type="number"
                    value={newKey.rateLimit}
                    onChange={(e) => setNewKey({ ...newKey, rateLimit: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date (optional)
                  </label>
                  <input
                    type="date"
                    value={newKey.expiryDate}
                    onChange={(e) => setNewKey({ ...newKey, expiryDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions
                  </label>
                  <div className="space-y-2">
                    {['recharge', 'billpay', 'wallet', 'transactions'].map((perm) => (
                      <label key={perm} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newKey.permissions.includes(perm)}
                          onChange={(e) => {
                            const perms = newKey.permissions.split(',').filter(p => p);
                            if (e.target.checked) {
                              perms.push(perm);
                            } else {
                              const index = perms.indexOf(perm);
                              if (index > -1) perms.splice(index, 1);
                            }
                            setNewKey({ ...newKey, permissions: perms.join(',') });
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateKey}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md"
                >
                  Create API Key
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}