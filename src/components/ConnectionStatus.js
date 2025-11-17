import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { checkBackendStatus, getConnectionStatus } from '../utils/networkUtils';

const ConnectionStatus = () => {
  const [status, setStatus] = useState('checking');
  const [connectionInfo, setConnectionInfo] = useState(null);
  const [lastCheck, setLastCheck] = useState(null);

  const checkStatus = async () => {
    setStatus('checking');
    try {
      const result = await checkBackendStatus();
      setStatus(result.status);
      setLastCheck(new Date());
    } catch (error) {
      setStatus('error');
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkStatus();
    setConnectionInfo(getConnectionStatus());
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'offline':
        return <WifiOff className="h-5 w-5 text-red-500" />;
      case 'checking':
        return <RefreshCw className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Wifi className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'Backend Connected';
      case 'offline':
        return 'Backend Offline';
      case 'checking':
        return 'Checking Connection...';
      case 'error':
        return 'Connection Error';
      default:
        return 'Unknown Status';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'offline':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'checking':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Connection Status</h3>
        <button
          onClick={checkStatus}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Refresh connection status"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Status Display */}
        <div className={`flex items-center p-3 rounded-lg border ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="ml-2 font-medium">{getStatusText()}</span>
        </div>

        {/* Connection Information */}
        {connectionInfo && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Frontend:</span>
              <span className="font-mono text-gray-900">{connectionInfo.frontend}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Backend:</span>
              <span className="font-mono text-gray-900">{connectionInfo.backend}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Proxy:</span>
              <span className="font-mono text-gray-900">{connectionInfo.proxy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">CORS:</span>
              <span className="font-mono text-gray-900">{connectionInfo.cors}</span>
            </div>
          </div>
        )}

        {/* Last Check */}
        {lastCheck && (
          <div className="text-xs text-gray-500 text-center">
            Last checked: {lastCheck.toLocaleTimeString()}
          </div>
        )}

        {/* Troubleshooting Tips */}
        {status === 'offline' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Troubleshooting Tips:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Make sure your Spring Boot backend is running on port 8080</li>
              <li>• Check if the backend has CORS configured for http://localhost:3000</li>
              <li>• Verify your backend endpoints match the expected paths</li>
              <li>• The proxy configuration should handle CORS automatically</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;
