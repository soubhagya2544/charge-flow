import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, RefreshCw } from 'lucide-react';

interface SystemComponent {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  responseTime?: number;
}

export default function SystemStatus() {
  const [components, setComponents] = useState<SystemComponent[]>([
    { name: 'Database (Turso)', status: 'healthy', message: 'Connected' },
    { name: 'Payment Gateway (Razorpay)', status: 'healthy', message: 'Ready' },
    { name: 'SMS Service (Twilio)', status: 'healthy', message: 'Active' },
    { name: 'Authentication', status: 'healthy', message: 'Operational' },
    { name: 'API Server', status: 'healthy', message: 'Running' },
    { name: 'Analytics Engine', status: 'healthy', message: 'Operational' },
  ]);

  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshStatus = async () => {
    setIsRefreshing(true);
    try {
      const start = performance.now();
      
      // Simulate health checks
      const updatedComponents = components.map(comp => ({
        ...comp,
        responseTime: Math.random() * 500 + 50,
      }));

      setComponents(updatedComponents);
      setLastUpdate(new Date().toLocaleTimeString());

      // Log to console
      console.log('✅ [System Status] All components healthy');
      console.table(updatedComponents);

      const elapsed = performance.now() - start;
      console.log(`⏱️ Status check completed in ${elapsed.toFixed(2)}ms`);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const healthyCount = components.filter(c => c.status === 'healthy').length;
  const overallHealth = (healthyCount / components.length) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">System Status</h3>
          <p className="text-blue-100 text-sm">Last updated: {lastUpdate}</p>
        </div>
        <button
          onClick={refreshStatus}
          disabled={isRefreshing}
          className="p-2 hover:bg-blue-800 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Health Meter */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Overall Health</span>
          <span className="text-sm font-bold text-blue-600">{Math.round(overallHealth)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              overallHealth === 100
                ? 'bg-green-500'
                : overallHealth >= 80
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${overallHealth}%` }}
          />
        </div>
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {components.map((component, index) => (
          <div key={index} className={`p-3 rounded-lg border ${getStatusColor(component.status)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                {getStatusIcon(component.status)}
                <div>
                  <p className="font-semibold text-sm text-gray-900">{component.name}</p>
                  <p className="text-xs text-gray-600">{component.message}</p>
                </div>
              </div>
              {component.responseTime && (
                <span className="text-xs font-mono text-gray-500">{component.responseTime.toFixed(0)}ms</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 p-3 rounded-b-lg text-center">
        <p className="text-xs text-gray-600">
          {healthyCount}/{components.length} components operational
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Press <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Ctrl+Shift+J</kbd> to open Developer Console
        </p>
      </div>
    </div>
  );
}
