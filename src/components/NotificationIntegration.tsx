import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Bell, MessageSquare, Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { notificationService } from '../lib/notification-service';
import { toast } from 'sonner';

interface NotificationIntegrationProps {
  userId?: string;
  phoneNumber?: string;
}

const NotificationIntegration: React.FC<NotificationIntegrationProps> = ({ userId, phoneNumber }) => {
  const [testPhone, setTestPhone] = useState(phoneNumber || '');
  const [testMessage, setTestMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notificationType, setNotificationType] = useState<'sms' | 'whatsapp'>('sms');
  const [results, setResults] = useState<{ type: string; success: boolean; message: string }[]>([]);

  const handleSendTest = async () => {
    if (!testPhone || !testMessage) {
      toast.error('Please enter phone number and message');
      return;
    }

    setIsLoading(true);

    try {
      let success = false;
      if (notificationType === 'sms') {
        success = await notificationService.sendSMS(testPhone, testMessage);
      } else {
        success = await notificationService.sendWhatsApp(testPhone, testMessage);
      }

      const newResult = {
        type: notificationType.toUpperCase(),
        success,
        message: success ? 'Notification sent successfully' : 'Failed to send notification',
      };

      setResults([newResult, ...results]);
      if (success) {
        toast.success('Notification sent!');
      } else {
        toast.error('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Error sending notification');
      setResults([
        {
          type: notificationType.toUpperCase(),
          success: false,
          message: 'Error: ' + String(error),
        },
        ...results,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTransactionAlert = async () => {
    if (!testPhone) {
      toast.error('Please enter phone number');
      return;
    }

    setIsLoading(true);
    try {
      const success = await notificationService.sendTransactionAlert(
        testPhone,
        'Mobile Recharge',
        500,
        'Jio',
        '9876543210'
      );

      setResults([
        {
          type: 'TRANSACTION_ALERT',
          success,
          message: success ? 'Transaction alert sent' : 'Failed to send alert',
        },
        ...results,
      ]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error sending alert');
    } finally {
      setIsLoading(false);
    }
  };

  const send2FACode = async () => {
    if (!testPhone) {
      toast.error('Please enter phone number');
      return;
    }

    setIsLoading(true);
    try {
      const code = Math.random().toString().slice(2, 8);
      const success = await notificationService.send2FACode(testPhone, code);

      setResults([
        {
          type: '2FA_CODE',
          success,
          message: success ? `Code sent: ${code}` : 'Failed to send code',
        },
        ...results,
      ]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error sending code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="test" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="test">Test Notifications</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Test Tab */}
        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Send Test Notifications
              </CardTitle>
              <CardDescription>Test SMS and WhatsApp integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  Test your notification channels before going live
                </AlertDescription>
              </Alert>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="testPhone">Phone Number</Label>
                <Input
                  id="testPhone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Notification Type */}
              <div className="space-y-2">
                <Label>Notification Type</Label>
                <div className="flex gap-2">
                  <Button
                    variant={notificationType === 'sms' ? 'default' : 'outline'}
                    onClick={() => setNotificationType('sms')}
                    disabled={isLoading}
                    className="flex-1 gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    SMS
                  </Button>
                  <Button
                    variant={notificationType === 'whatsapp' ? 'default' : 'outline'}
                    onClick={() => setNotificationType('whatsapp')}
                    disabled={isLoading}
                    className="flex-1 gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp
                  </Button>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="testMessage">Custom Message</Label>
                <textarea
                  id="testMessage"
                  placeholder="Enter your test message..."
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  disabled={isLoading}
                  className="w-full p-2 border rounded-lg text-sm"
                  rows={4}
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button onClick={handleSendTest} disabled={isLoading} className="gap-2">
                  {isLoading ? 'Sending...' : 'Send Custom'}
                </Button>
                <Button onClick={sendTransactionAlert} disabled={isLoading} variant="outline">
                  Send Transaction Alert
                </Button>
                <Button onClick={send2FACode} disabled={isLoading} variant="outline" className="sm:col-span-2">
                  Send 2FA Test Code
                </Button>
              </div>

              {/* Results */}
              {results.length > 0 && (
                <div className="space-y-2">
                  <Label>Recent Results</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {results.map((result, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg flex gap-2 items-start ${
                          result.success
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                        }`}
                      >
                        {result.success ? (
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="text-sm flex-1">
                          <p className="font-semibold">{result.type}</p>
                          <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                            {result.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
              <CardDescription>Pre-configured notification templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  name: 'Transaction Success',
                  message: 'Your ₹500 mobile recharge to 9876543210 on Jio has been processed successfully.',
                },
                {
                  name: 'Wallet Top-up',
                  message: 'Your wallet has been credited with ₹1000. New balance: ₹5000',
                },
                {
                  name: 'Transaction Failed',
                  message: 'Your ₹500 recharge failed due to insufficient balance. Please try again.',
                },
                {
                  name: 'Referral Bonus',
                  message: 'You earned ₹50 as referral bonus! Total referrals: 5. Withdraw anytime.',
                },
              ].map((template, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">{template.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>Recent sent notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No notifications sent yet</p>
              ) : (
                <div className="space-y-3">
                  {results.slice(0, 10).map((result, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-semibold text-sm">{result.type}</p>
                        <p className="text-xs text-gray-600">{new Date().toLocaleTimeString()}</p>
                      </div>
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationIntegration;
