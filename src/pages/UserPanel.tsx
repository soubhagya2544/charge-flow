import { useState } from 'react';
import { Home, Smartphone, Wallet, History, Users, User, LogOut } from 'lucide-react';
import UserDashboard from '../components/user/UserDashboard';
import RechargeServices from '../components/user/RechargeServices';
import WalletManagement from '../components/user/WalletManagement';
import TransactionHistory from '../components/user/TransactionHistory';
import ReferralProgram from '../components/user/ReferralProgram';
import ProfileSettings from '../components/user/ProfileSettings';

interface UserPanelProps {
  onLogout: () => void;
  userEmail: string;
}

export default function UserPanel({ onLogout, userEmail }: UserPanelProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">Charge Flow</h1>
          <p className="text-sm text-gray-600">User Panel</p>
        </div>
        
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Home className="w-5 h-5" />
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('recharge')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'recharge' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Smartphone className="w-5 h-5" />
            Recharge & Bills
          </button>
          
          <button
            onClick={() => setActiveTab('wallet')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'wallet' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Wallet className="w-5 h-5" />
            Wallet
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'history' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <History className="w-5 h-5" />
            Transactions
          </button>
          
          <button
            onClick={() => setActiveTab('referral')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'referral' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            Referral Program
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <User className="w-5 h-5" />
            Profile
          </button>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'dashboard' && <UserDashboard />}
        {activeTab === 'recharge' && <RechargeServices />}
        {activeTab === 'wallet' && <WalletManagement />}
        {activeTab === 'history' && <TransactionHistory />}
        {activeTab === 'referral' && <ReferralProgram />}
        {activeTab === 'profile' && <ProfileSettings />}
      </div>
    </div>
  );
}
