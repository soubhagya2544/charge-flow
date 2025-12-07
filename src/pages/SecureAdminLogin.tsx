import { useState } from 'react';
import { Shield, Mail, Lock } from 'lucide-react';
import { useEntity } from '../hooks/useEntity';
import { userEntityConfig } from '../entities';
import { user2FAEntityConfig } from '../entities/User2FA';
import TwoFactorVerification from '../components/TwoFactorVerification';

interface SecureAdminLoginProps {
  onLogin: (role: string, email: string) => void;
}

type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: string;
  kycStatus?: string;
  accountStatus?: string;
  aadharNumber?: string;
  panNumber?: string;
  address?: string;
  parentId?: string;
  ipAddress?: string;
  twoFactorEnabled?: string;
  created_at: string;
  updated_at: string;
};

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

export default function SecureAdminLogin({ onLogin }: SecureAdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [current2FA, setCurrent2FA] = useState<User2FA | null>(null);
  const { items: users } = useEntity<User>(userEntityConfig);
  const { items: twoFactorRecords } = useEntity<User2FA>(user2FAEntityConfig);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    // Find admin user
    const adminUser = users.find(
      (u) => u.email === email && u.role === 'admin'
    );

    if (!adminUser) {
      setError('Invalid admin credentials');
      return;
    }

    if (adminUser.password !== password) {
      setError('Invalid admin credentials');
      return;
    }

    if (adminUser.accountStatus === 'suspended' || adminUser.accountStatus === 'inactive') {
      setError('Admin account is suspended');
      return;
    }

    // Check if admin has 2FA enabled
    const user2FA = twoFactorRecords.find(
      (r) => r.userId === email && r.enabled === 'true'
    );

    if (user2FA) {
      setCurrent2FA(user2FA);
      setShow2FA(true);
    } else {
      onLogin('admin', email);
    }
  };

  const handle2FASuccess = () => {
    setShow2FA(false);
    onLogin('admin', email);
  };

  if (show2FA && current2FA) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Access</h1>
            <p className="text-gray-600">Secure Administrator Portal</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="admin@chargeflow.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter admin password"
                  required
                />
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-yellow-800">
                  <p className="font-semibold mb-1">Restricted Access</p>
                  <p>This portal is exclusively for authorized administrators. All login attempts are monitored and logged.</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            >
              Secure Admin Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-blue-600 hover:text-blue-700">
              ← Back to User Login
            </a>
          </div>
        </div>

        <p className="text-center text-white text-sm mt-8 opacity-75">
          🔒 Secure Administrator Portal - Authorized Access Only
        </p>
      </div>
    </div>
  );
}
