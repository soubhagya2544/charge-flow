import axios from 'axios';

export interface NotificationPayload {
  recipient: string;
  message: string;
  type: 'sms' | 'whatsapp' | 'email';
  templateId?: string;
  variables?: Record<string, any>;
}

class NotificationService {
  private twilioAccountSid: string;
  private twilioAuthToken: string;
  private twilioPhoneNumber: string;

  constructor() {
    this.twilioAccountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID || '';
    this.twilioAuthToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN || '';
    this.twilioPhoneNumber = import.meta.env.VITE_TWILIO_PHONE_NUMBER || '';
  }

  // Send SMS notification
  async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${this.twilioAccountSid}/Messages.json`,
        {
          From: this.twilioPhoneNumber,
          To: phoneNumber,
          Body: message,
        },
        {
          auth: {
            username: this.twilioAccountSid,
            password: this.twilioAuthToken,
          },
        }
      );
      return response.status === 201;
    } catch (error) {
      console.error('SMS sending failed:', error);
      return false;
    }
  }

  // Send WhatsApp notification
  async sendWhatsApp(phoneNumber: string, message: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${this.twilioAccountSid}/Messages.json`,
        {
          From: `whatsapp:${this.twilioPhoneNumber}`,
          To: `whatsapp:${phoneNumber}`,
          Body: message,
        },
        {
          auth: {
            username: this.twilioAccountSid,
            password: this.twilioAuthToken,
          },
        }
      );
      return response.status === 201;
    } catch (error) {
      console.error('WhatsApp sending failed:', error);
      return false;
    }
  }

  // Send transaction notification
  async sendTransactionAlert(
    phoneNumber: string,
    transactionType: string,
    amount: number,
    operator: string,
    recipient: string
  ): Promise<boolean> {
    const message = `Charge Flow: Your ${transactionType} of ₹${amount} to ${recipient} on ${operator} has been processed successfully. Thank you!`;
    return this.sendSMS(phoneNumber, message);
  }

  // Send wallet top-up notification
  async sendWalletTopUpAlert(
    phoneNumber: string,
    amount: number,
    balance: number
  ): Promise<boolean> {
    const message = `Charge Flow: Your wallet has been credited with ₹${amount}. New balance: ₹${balance}`;
    return this.sendSMS(phoneNumber, message);
  }

  // Send failed transaction notification
  async sendFailureAlert(
    phoneNumber: string,
    transactionType: string,
    amount: number,
    reason: string
  ): Promise<boolean> {
    const message = `Charge Flow: Your ${transactionType} of ₹${amount} failed. Reason: ${reason}. Please try again.`;
    return this.sendSMS(phoneNumber, message);
  }

  // Send referral bonus notification
  async sendReferralBonusAlert(
    phoneNumber: string,
    bonusAmount: number,
    referralCount: number
  ): Promise<boolean> {
    const message = `Charge Flow: You earned ₹${bonusAmount} as referral bonus! Total referrals: ${referralCount}. Withdraw anytime from your wallet.`;
    return this.sendSMS(phoneNumber, message);
  }

  // Send password reset notification
  async sendPasswordResetCode(
    phoneNumber: string,
    resetCode: string
  ): Promise<boolean> {
    const message = `Charge Flow: Your password reset code is ${resetCode}. Valid for 10 minutes. Do not share this code.`;
    return this.sendSMS(phoneNumber, message);
  }

  // Send 2FA code
  async send2FACode(
    phoneNumber: string,
    code: string
  ): Promise<boolean> {
    const message = `Charge Flow: Your 2-factor authentication code is ${code}. Valid for 5 minutes.`;
    return this.sendSMS(phoneNumber, message);
  }

  // Send generic notification
  async sendNotification(payload: NotificationPayload): Promise<boolean> {
    try {
      if (payload.type === 'sms') {
        return await this.sendSMS(payload.recipient, payload.message);
      } else if (payload.type === 'whatsapp') {
        return await this.sendWhatsApp(payload.recipient, payload.message);
      }
      return false;
    } catch (error) {
      console.error('Notification sending failed:', error);
      return false;
    }
  }
}

export const notificationService = new NotificationService();
