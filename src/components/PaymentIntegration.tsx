import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { CreditCard, Zap, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { paymentGateway } from '../lib/payment-gateway';
import { notificationService } from '../lib/notification-service';
import { toast } from 'sonner';

interface PaymentIntegrationProps {
  userId?: string;
  onSuccess?: (orderId: string, paymentId: string) => void;
}

const PaymentIntegration: React.FC<PaymentIntegrationProps> = ({ userId, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const handleTopUp = async () => {
    if (!amount || !phoneNumber) {
      toast.error('Please enter amount and phone number');
      return;
    }

    setIsLoading(true);
    setPaymentStatus('processing');

    try {
      // Create order on Razorpay
      const order = await paymentGateway.createOrder(
        parseFloat(amount),
        `TOPUP-${userId}-${Date.now()}`,
        {
          userId,
          type: 'wallet_topup',
          phone: phoneNumber,
        }
      );

      setOrderDetails(order);

      // Initialize Razorpay payment dialog
      if (window.Razorpay) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          order_id: order.id,
          name: 'Charge Flow',
          description: `Wallet Top-up: ₹${amount}`,
          prefill: {
            contact: phoneNumber,
          },
          handler: async (response: any) => {
            // Verify payment
            const isValid = paymentGateway.verifyPaymentSignature(
              order.id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (isValid) {
              setPaymentStatus('success');
              toast.success('Payment successful! Wallet updated.');
              
              // Send confirmation notification
              await notificationService.sendWalletTopUpAlert(
                phoneNumber,
                parseFloat(amount),
                parseFloat(amount) // This should be the new balance
              );

              onSuccess?.(order.id, response.razorpay_payment_id);
              
              // Reset form
              setTimeout(() => {
                setAmount('');
                setPhoneNumber('');
                setPaymentStatus('idle');
              }, 2000);
            } else {
              setPaymentStatus('failed');
              toast.error('Payment verification failed');
            }
          },
          modal: {
            ondismiss: () => {
              setPaymentStatus('failed');
              setIsLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error('Razorpay not loaded. Please refresh and try again.');
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to create payment order');
      setPaymentStatus('failed');
    } finally {
      setIsLoading(false);
    }
  };

  const predefinedAmounts = [100, 500, 1000, 5000, 10000];

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          Wallet Top-up
        </CardTitle>
        <CardDescription>Add funds to your Charge Flow wallet securely</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentStatus === 'success' && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Payment completed successfully! Your wallet has been credited.
            </AlertDescription>
          </Alert>
        )}

        {paymentStatus === 'failed' && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              Payment failed. Please try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 9876543210"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₹)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isLoading}
            min="100"
            max="100000"
          />
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {predefinedAmounts.map((value) => (
            <Button
              key={value}
              variant="outline"
              size="sm"
              onClick={() => setAmount(value.toString())}
              disabled={isLoading}
              className="text-xs"
            >
              ₹{value / 1000}K
            </Button>
          ))}
        </div>

        {/* Security Notice */}
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700 text-sm">
            Your payment is secured with industry-standard encryption
          </AlertDescription>
        </Alert>

        {/* Pay Button */}
        <Button
          onClick={handleTopUp}
          disabled={isLoading || !amount || !phoneNumber}
          className="w-full gap-2"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Pay ₹{amount || '0'}
            </>
          )}
        </Button>

        {/* Order Details */}
        {orderDetails && (
          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
            <p>Order ID: {orderDetails.id}</p>
            <p>Amount: ₹{(orderDetails.amount / 100).toFixed(2)}</p>
            <p>Status: {orderDetails.status}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentIntegration;

// Make Razorpay window accessible
declare global {
  interface Window {
    Razorpay?: any;
  }
}
