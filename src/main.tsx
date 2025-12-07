import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

// Suppress extension-related console errors and warnings
const originalError = console.error;
const originalWarn = console.warn;

console.error = function(...args: any[]) {
  const message = String(args[0]);
  // Silently ignore extension-related errors
  if (
    message.includes('disconnected') ||
    message.includes('ton') ||
    message.includes('chrome-extension') ||
    message.includes('dapp') ||
    message.includes('requestAccounts')
  ) {
    return;
  }
  originalError.apply(console, args);
};

console.warn = function(...args: any[]) {
  const message = String(args[0]);
  // Silently ignore extension-related warnings
  if (
    message.includes('disconnected') ||
    message.includes('ton') ||
    message.includes('chrome-extension')
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

// Global error handler for uncaught errors from extensions
window.addEventListener('error', (event) => {
  const message = String(event.error?.message || event.message || '');
  const stack = String(event.error?.stack || '');
  
  // Prevent extension errors from propagating
  if (
    message.includes('disconnected') ||
    message.includes('port object') ||
    message.includes('ton') ||
    message.includes('requestAccounts') ||
    message.includes('chrome-extension') ||
    stack.includes('chrome-extension') ||
    stack.includes('extensionServiceWorker')
  ) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    event.preventDefault();
    return false;
  }
}, true);

// Handle unhandled promise rejections from extensions
window.addEventListener('unhandledrejection', (event) => {
  const message = String(event.reason?.message || event.reason || '');
  const stack = String(event.reason?.stack || '');
  
  if (
    message.includes('disconnected') ||
    message.includes('port object') ||
    message.includes('ton') ||
    message.includes('requestAccounts') ||
    message.includes('chrome-extension') ||
    stack.includes('chrome-extension') ||
    stack.includes('extensionServiceWorker')
  ) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    event.preventDefault();
    return false;
  }
}, true);

// Block extension messages at the window level
const originalPostMessage = window.postMessage;
window.postMessage = function(message: any, ...args: any[]) {
  // Silently ignore extension-related postMessage calls
  if (typeof message === 'object' && message !== null) {
    const msgStr = JSON.stringify(message);
    if (msgStr.includes('ton') || msgStr.includes('dapp') || msgStr.includes('requestAccounts')) {
      return;
    }
  }
  return originalPostMessage.call(this, message, ...args);
};

// Database is automatically initialized when sandbox starts - just render!
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <App />
      </Router>
    </ErrorBoundary>
  </React.StrictMode>
);
