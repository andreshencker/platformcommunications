export interface SendSmsPayload {
  to: string;
  text: string;
}

export interface SmsSendResult {
  success: boolean;
  provider: string;
  error?: string | null;
}

export interface SmsChannel {
  sendSms(payload: SendSmsPayload): Promise<SmsSendResult>;
}