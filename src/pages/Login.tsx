import { useState } from 'react';
import { Shield, Mail, Lock } from 'lucide-react';
import { useEntity } from '../hooks/useEntity';
import { user2FAEntityConfig } from '../entities/User2FA';
import TwoFactorVerification from '../components/TwoFactorVerification';
import Signup from './Signup';

interface LoginProps {
  onLogin: (role: string, email: string) => void;
}

type User2FA = {
  id: number;
  userId: string;
  enabled: string;
  secret: string;
  backupCodes: string;
  verifiedAt: string;
  created_at: string;
  updated_at: string;
};

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [show2FA, setShow2FA] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [current2FA, setCurrent2FA] = useState<User2FA | null>(null);
  const { items: twoFactorRecords } = useEntity<User2FA>(user2FAEntityConfig);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Check if user has 2FA enabled
      const user2FA = twoFactorRecords.find(
        (r) => r.userId === email && r.enabled === 'true'
      );

      if (user2FA) {
        setCurrent2FA(user2FA);
        setShow2FA(true);
      } else {
        onLogin(selectedRole, email);
      }
    }
  };

  const handle2FASuccess = () => {
    setShow2FA(false);
    onLogin(selectedRole, email);
  };

  if (showSignup) {
    return (
      <Signup
        onSuccess={() => setShowSignup(false)}
        onBackToLogin={() => setShowSignup(false)}
      />
    );
  }

  if (show2FA && current2FA) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center px-4">
        <TwoFactorVerification
          secret={current2FA.secret}
          backupCodes={JSON.parse(current2FA.backupCodes)}
          onSuccess={handle2FASuccess}
          onCancel={() => setShow2FA(false)}
          userEmail={email}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Charge Flow</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Role
              </label>
              <div className="grid grid-cols-3 gap-2">

                <button
                  type="button"
                  onClick={() => setSelectedRole('api_user')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedRole === 'api_user'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  API User
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('retailer')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedRole === 'retailer'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Retailer
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('b2b_user')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedRole === 'b2b_user'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  B2B User
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@chargeflow.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
              Forgot your password?
            </a>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => setShowSignup(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-white text-sm mt-8">
          © 2024 Charge Flow. All rights reserved.
        </p>
      </div>
    </div>
  );
}
