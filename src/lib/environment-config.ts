/**
 * Environment Configuration for Charge Flow
 * Handles environment variables and production settings
 */

export interface EnvironmentConfig {
  apiUrl: string;
  apiKey: string;
  environment: 'development' | 'staging' | 'production';
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableAnalytics: boolean;
  enableNotifications: boolean;
  razorpay: {
    keyId: string;
    keySecret: string;
    enabled: boolean;
  };
  twilio: {
    accountSid: string;
    authToken: string;
    phoneNumber: string;
    enabled: boolean;
  };
  database: {
    url: string;
    authToken: string;
  };
  security: {
    enableCSRF: boolean;
    enableRateLimit: boolean;
    enableCORS: boolean;
    corsOrigins: string[];
  };
  cache: {
    enabled: boolean;
    ttl: number;
  };
}

class EnvironmentConfigService {
  private config: EnvironmentConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): EnvironmentConfig {
    const isDev = import.meta.env.DEV;
    const isProd = import.meta.env.PROD;

    return {
      apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
      apiKey: import.meta.env.VITE_API_KEY || '',
      environment: isProd ? 'production' : isDev ? 'development' : 'staging',
      logLevel: isProd ? 'error' : isDev ? 'debug' : 'info',
      enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
      enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',
      razorpay: {
        keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        keySecret: import.meta.env.VITE_RAZORPAY_KEY_SECRET || '',
        enabled: !!import.meta.env.VITE_RAZORPAY_KEY_ID,
      },
      twilio: {
        accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
        authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '',
        phoneNumber: import.meta.env.VITE_TWILIO_PHONE_NUMBER || '',
        enabled: !!import.meta.env.VITE_TWILIO_ACCOUNT_SID,
      },
      database: {
        url: import.meta.env.VITE_TURSO_DATABASE_URL || '',
        authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN || '',
      },
      security: {
        enableCSRF: true,
        enableRateLimit: true,
        enableCORS: true,
        corsOrigins: [
          'http://localhost:3000',
          'http://localhost:5173',
          import.meta.env.VITE_PRODUCTION_URL || '',
        ].filter(Boolean),
      },
      cache: {
        enabled: isProd,
        ttl: 3600, // 1 hour
      },
    };
  }

  getConfig(): EnvironmentConfig {
    return this.config;
  }

  isProduction(): boolean {
    return this.config.environment === 'production';
  }

  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  isStaging(): boolean {
    return this.config.environment === 'staging';
  }

  getPaymentConfig() {
    return this.config.razorpay;
  }

  getNotificationConfig() {
    return this.config.twilio;
  }

  getDatabaseConfig() {
    return this.config.database;
  }

  getSecurityConfig() {
    return this.config.security;
  }

  log(level: string, message: string, data?: any) {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    if (levels[level as keyof typeof levels] >= levels[this.config.logLevel as keyof typeof levels]) {
      console.log(`[${level.toUpperCase()}] ${message}`, data || '');
    }
  }
}

export const environmentConfig = new EnvironmentConfigService();
