export type WidgetType = 
  | 'wallet_balance'
  | 'total_transactions'
  | 'monthly_revenue'
  | 'success_rate'
  | 'recent_activity'
  | 'quick_recharge'
  | 'commission_earned'
  | 'pending_orders'
  | 'user_growth'
  | 'top_services'
  | 'daily_stats'
  | 'referral_earnings'
  | 'transaction_chart'
  | 'api_usage';

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  size: 'small' | 'medium' | 'large';
  category: 'finance' | 'activity' | 'analytics' | 'services' | 'users';
}

export const availableWidgets: WidgetConfig[] = [
  {
    id: 'wallet_balance',
    type: 'wallet_balance',
    title: 'Wallet Balance',
    description: 'Current wallet balance',
    size: 'small',
    category: 'finance'
  },
  {
    id: 'total_transactions',
    type: 'total_transactions',
    title: 'Total Transactions',
    description: 'All-time transaction count',
    size: 'small',
    category: 'activity'
  },
  {
    id: 'monthly_revenue',
    type: 'monthly_revenue',
    title: 'Monthly Revenue',
    description: 'This month\'s revenue',
    size: 'small',
    category: 'finance'
  },
  {
    id: 'success_rate',
    type: 'success_rate',
    title: 'Success Rate',
    description: 'Transaction success rate',
    size: 'small',
    category: 'analytics'
  },
  {
    id: 'recent_activity',
    type: 'recent_activity',
    title: 'Recent Activity',
    description: 'Latest transactions',
    size: 'large',
    category: 'activity'
  },
  {
    id: 'quick_recharge',
    type: 'quick_recharge',
    title: 'Quick Recharge',
    description: 'Fast recharge options',
    size: 'medium',
    category: 'services'
  },
  {
    id: 'commission_earned',
    type: 'commission_earned',
    title: 'Commission Earned',
    description: 'Total commissions',
    size: 'small',
    category: 'finance'
  },
  {
    id: 'pending_orders',
    type: 'pending_orders',
    title: 'Pending Orders',
    description: 'Orders awaiting processing',
    size: 'small',
    category: 'activity'
  },
  {
    id: 'user_growth',
    type: 'user_growth',
    title: 'User Growth',
    description: 'New users this month',
    size: 'medium',
    category: 'users'
  },
  {
    id: 'top_services',
    type: 'top_services',
    title: 'Top Services',
    description: 'Most used services',
    size: 'medium',
    category: 'services'
  },
  {
    id: 'daily_stats',
    type: 'daily_stats',
    title: 'Daily Statistics',
    description: 'Today\'s performance',
    size: 'large',
    category: 'analytics'
  },
  {
    id: 'referral_earnings',
    type: 'referral_earnings',
    title: 'Referral Earnings',
    description: 'Earnings from referrals',
    size: 'small',
    category: 'finance'
  },
  {
    id: 'transaction_chart',
    type: 'transaction_chart',
    title: 'Transaction Chart',
    description: 'Weekly transaction trends',
    size: 'large',
    category: 'analytics'
  },
  {
    id: 'api_usage',
    type: 'api_usage',
    title: 'API Usage',
    description: 'API request statistics',
    size: 'medium',
    category: 'analytics'
  }
];
