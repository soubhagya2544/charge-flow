import { useState } from "react";
import { verifyTOTP } from "../lib/totp";

type TwoFactorVerificationProps = {
  secret: string;
  backupCodes: string[];
  onSuccess: () => void;
  onCancel: () => void;
  userEmail: string;
};

export default function TwoFactorVerification({
  secret,
  backupCodes,
  onSuccess,
  onCancel,
  userEmail,
}: TwoFactorVerificationProps) {
  const [code, setCode] = useState("");
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (code.length === 0) {
      setError("Please enter a code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (useBackupCode) {
        const isValid = backupCodes.includes(code.toUpperCase().replace(/\s/g, ""));
        if (isValid) {
          onSuccess();
        } else {
          setError("Invalid backup code. Please try again.");
        }
      } else {
        if (code.length !== 6) {
          setError("Code must be 6 digits");
          setLoading(false);
          return;
        }
        const isValid = await verifyTOTP(code, secret);
        if (isValid) {
          onSuccess();
        } else {
          setError("Invalid code. Please try again.");
        }
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && code.length > 0) {
      handleVerify();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
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
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Two-Factor Authentication</h2>
              <p className="text-sm text-gray-600">{userEmail}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-gray-600 mb-4">
              {useBackupCode
                ? "Enter one of your backup codes to sign in:"
                : "Enter the 6-digit code from your authenticator app:"}
            </p>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                if (useBackupCode) {
                  setCode(e.target.value.toUpperCase());
                } else {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setCode(value);
                }
                setError("");
              }}
              onKeyPress={handleKeyPress}
              placeholder={useBackupCode ? "XXXX-XXXX-XXXX-XXXX" : "000000"}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={useBackupCode ? 19 : 6}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <svg
                  className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                setUseBackupCode(!useBackupCode);
                setCode("");
                setError("");
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {useBackupCode ? "Use authenticator code instead" : "Use a backup code"}
            </button>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleVerify}
              disabled={loading || code.length === 0}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
