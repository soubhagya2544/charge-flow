import axios from 'axios';

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, any>;
  created_at: number;
}

export interface RazorpayPayment {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

class PaymentGateway {
  private apiKey: string;
  private apiSecret: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
    this.apiSecret = import.meta.env.VITE_RAZORPAY_KEY_SECRET || '';
  }

  // Create order on Razorpay
  async createOrder(amount: number, receipt: string, notes: Record<string, any> = {}): Promise<RazorpayOrder> {
    try {
      const response = await axios.post(
        'https://api.razorpay.com/v1/orders',
        {
          amount: Math.round(amount * 100), // Convert to paise
          currency: 'INR',
          receipt,
          notes,
        },
        {
          auth: {
            username: this.apiKey,
            password: this.apiSecret,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Razorpay order creation failed:', error);
      throw new Error('Failed to create payment order');
    }
  }

  // Verify payment signature
  verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    try {
      const crypto = require('crypto');
      const text = `${orderId}|${paymentId}`;
      const generated_signature = crypto
        .createHmac('sha256', this.apiSecret)
        .update(text)
        .digest('hex');
      return generated_signature === signature;
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }

  // Fetch payment details
  async getPayment(paymentId: string) {
    try {
      const response = await axios.get(
        `https://api.razorpay.com/v1/payments/${paymentId}`,
        {
          auth: {
            username: this.apiKey,
            password: this.apiSecret,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch payment details:', error);
      throw error;
    }
  }

  // Refund payment
  async refundPayment(paymentId: string, amount?: number) {
    try {
      const refundData: any = {};
      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to paise
      }
      refundData.notes = { refund_reason: 'User requested' };

      const response = await axios.post(
        `https://api.razorpay.com/v1/payments/${paymentId}/refund`,
        refundData,
        {
          auth: {
            username: this.apiKey,
            password: this.apiSecret,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Refund failed:', error);
      throw error;
    }
  }
}

export const paymentGateway = new PaymentGateway();
