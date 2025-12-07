import { useState, useEffect } from "react";
import { useEntity } from "../hooks/useEntity";
import { user2FAEntityConfig } from "../entities/User2FA";
import {
  generateSecret,
  generateQRCodeURL,
  verifyTOTP,
  generateBackupCodes,
  formatSecret,
} from "../lib/totp";

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

type TwoFactorSetupProps = {
  userEmail: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function TwoFactorSetup({
  userEmail,
  onClose,
  onSuccess,
}: TwoFactorSetupProps) {
  const { items: twoFactorRecords, create, update } = useEntity<User2FA>(user2FAEntityConfig);
  const [step, setStep] = useState<"setup" | "verify" | "backup" | "complete">("setup");
  const [secret, setSecret] = useState("");
  const [qrCodeURL, setQrCodeURL] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const newSecret = generateSecret();
    setSecret(newSecret);
    setQrCodeURL(generateQRCodeURL(newSecret, userEmail));
  }, [userEmail]);

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const isValid = await verifyTOTP(verificationCode, secret);

      if (isValid) {
        const codes = generateBackupCodes();
        setBackupCodes(codes);
        setStep("backup");
      } else {
        setError("Invalid code. Please try again.");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const existingRecord = twoFactorRecords.find((r) => r.userId === userEmail);

      if (existingRecord) {
        await update(existingRecord.id, {
          enabled: "true",
          secret: secret,
          backupCodes: JSON.stringify(backupCodes),
          verifiedAt: new Date().toISOString(),
        });
      } else {
        await create({
          userId: userEmail,
          enabled: "true",
          secret: secret,
          backupCodes: JSON.stringify(backupCodes),
          verifiedAt: new Date().toISOString(),
        });
      }

      setStep("complete");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError("Failed to enable 2FA. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    const content = `Charge Flow - Two-Factor Authentication Backup Codes\n\nUser: ${userEmail}\nGenerated: ${new Date().toLocaleString()}\n\n${backupCodes.join("\n")}\n\nKeep these codes safe. Each code can only be used once.`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "charge-flow-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Enable Two-Factor Authentication
            </h2>
            <button
              onClick={onClose}
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
        </div>

        <div className="p-6">
          {step === "setup" && (
            <div className="space-y-6">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">
                      Secure Your Account with 2FA
                    </h3>
                    <p className="text-sm text-blue-800">
                      Two-factor authentication adds an extra layer of security to your account.
                      You'll need your password and a code from your authenticator app to sign in.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Step 1: Install an Authenticator App</h3>
                <p className="text-gray-600 mb-3">
                  Download and install one of these apps on your mobile device:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="font-medium text-gray-900">Google Authenticator</div>
                    <div className="text-sm text-gray-600">iOS & Android</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="font-medium text-gray-900">Microsoft Authenticator</div>
                    <div className="text-sm text-gray-600">iOS & Android</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="font-medium text-gray-900">Authy</div>
                    <div className="text-sm text-gray-600">iOS & Android</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Step 2: Scan QR Code</h3>
                <p className="text-gray-600 mb-4">
                  Open your authenticator app and scan this QR code:
                </p>
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <img src={qrCodeURL} alt="QR Code" className="w-48 h-48" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Or enter this code manually:</p>
                    <code className="bg-gray-100 px-4 py-2 rounded font-mono text-sm">
                      {formatSecret(secret)}
                    </code>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep("verify")}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Continue to Verification
              </button>
            </div>
          )}

          {step === "verify" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Step 3: Verify Your Code</h3>
                <p className="text-gray-600 mb-4">
                  Enter the 6-digit code from your authenticator app to verify the setup:
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setVerificationCode(value);
                    setError("");
                  }}
                  placeholder="000000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={6}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep("setup")}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleVerify}
                  disabled={loading || verificationCode.length !== 6}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
              </div>
            </div>
          )}

          {step === "backup" && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5"
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
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">
                      Save Your Backup Codes
                    </h3>
                    <p className="text-sm text-amber-800">
                      Store these codes in a safe place. You can use them to access your account if
                      you lose your authenticator device.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Backup Codes</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {backupCodes.map((code, index) => (
                      <code
                        key={index}
                        className="bg-white px-3 py-2 rounded border border-gray-300 font-mono text-sm text-center"
                      >
                        {code}
                      </code>
                    ))}
                  </div>
                </div>
              </div>

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
                <span>Download Backup Codes</span>
              </button>

              <button
                onClick={handleComplete}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? "Enabling 2FA..." : "Complete Setup"}
              </button>
            </div>
          )}

          {step === "complete" && (
            <div className="text-center py-8">
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                2FA Successfully Enabled!
              </h3>
              <p className="text-gray-600">
                Your account is now protected with two-factor authentication.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
