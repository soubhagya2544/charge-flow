import { useState, useEffect } from "react";
import { useEntity } from "../hooks/useEntity";
import { user2FAEntityConfig } from "../entities/User2FA";
import TwoFactorSetup from "./TwoFactorSetup";
import { generateBackupCodes } from "../lib/totp";

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

type TwoFactorManagementProps = {
  userEmail: string;
};

export default function TwoFactorManagement({ userEmail }: TwoFactorManagementProps) {
  const { items: twoFactorRecords, loading, update } = useEntity<User2FA>(user2FAEntityConfig);
  const [showSetup, setShowSetup] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<User2FA | null>(null);

  useEffect(() => {
    const record = twoFactorRecords.find((r) => r.userId === userEmail);
    setCurrentRecord(record || null);
  }, [twoFactorRecords, userEmail]);

  const is2FAEnabled = currentRecord?.enabled === "true";

  const handleDisable2FA = async () => {
    if (currentRecord) {
      await update(currentRecord.id, {
        enabled: "false",
      });
      setShowDisableConfirm(false);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    if (currentRecord) {
      const newCodes = generateBackupCodes();
      await update(currentRecord.id, {
        backupCodes: JSON.stringify(newCodes),
      });
      setShowBackupCodes(false);
    }
  };

  const downloadBackupCodes = () => {
    if (!currentRecord) return;
    const codes = JSON.parse(currentRecord.backupCodes);
    const content = `Charge Flow - Two-Factor Authentication Backup Codes\n\nUser: ${userEmail}\nGenerated: ${new Date(currentRecord.updated_at).toLocaleString()}\n\n${codes.join("\n")}\n\nKeep these codes safe. Each code can only be used once.`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "charge-flow-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Two-Factor Authentication</h3>
          <p className="text-sm text-gray-600 mt-1">
            Add an extra layer of security to your account
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            is2FAEnabled
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {is2FAEnabled ? "Enabled" : "Disabled"}
        </div>
      </div>

      {!is2FAEnabled ? (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <svg
                className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  Protect Your Account
                </h4>
                <p className="text-sm text-blue-800">
                  Two-factor authentication (2FA) requires both your password and a code from your
                  mobile device to sign in. This prevents unauthorized access even if your password
                  is compromised.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSetup(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Enable Two-Factor Authentication
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <svg
                className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h4 className="font-semibold text-green-900 mb-1">
                  2FA is Active
                </h4>
                <p className="text-sm text-green-800">
                  Your account is protected with two-factor authentication. Enabled on{" "}
                  {currentRecord && new Date(currentRecord.verifiedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setShowBackupCodes(true)}
              className="bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              View Backup Codes
            </button>
            <button
              onClick={() => setShowDisableConfirm(true)}
              className="bg-red-100 text-red-700 py-3 rounded-lg font-semibold hover:bg-red-200 transition-colors"
            >
              Disable 2FA
            </button>
          </div>
        </div>
      )}

      {showSetup && (
        <TwoFactorSetup
          userEmail={userEmail}
          onClose={() => setShowSetup(false)}
          onSuccess={() => {
            setShowSetup(false);
          }}
        />
      )}

      {showDisableConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Disable 2FA?</h3>
                <p className="text-sm text-gray-600">This will make your account less secure</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to disable two-factor authentication? Your account will only be
              protected by your password.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDisableConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDisable2FA}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Disable 2FA
              </button>
            </div>
          </div>
        </div>
      )}

      {showBackupCodes && currentRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Backup Codes</h3>
              <button
                onClick={() => setShowBackupCodes(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-amber-800">
                Use these codes if you lose access to your authenticator app. Each code can only be
                used once.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 gap-2">
                {JSON.parse(currentRecord.backupCodes).map((code: string, index: number) => (
                  <code
                    key={index}
                    className="bg-white px-3 py-2 rounded border border-gray-300 font-mono text-sm text-center"
                  >
                    {code}
                  </code>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={downloadBackupCodes}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>Download Codes</span>
              </button>
              <button
                onClick={handleRegenerateBackupCodes}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Regenerate Backup Codes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
