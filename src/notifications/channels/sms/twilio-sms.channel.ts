import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { SmsChannel, SendSmsPayload, SmsSendResult } from './sms-channel.interface';

@Injectable()
export class TwilioSmsChannel implements SmsChannel {
  private readonly logger = new Logger(TwilioSmsChannel.name);

  async sendSms(_payload: SendSmsPayload): Promise<SmsSendResult> {
    // Más adelante puedes implementar Twilio u otro proveedor.
    this.logger.warn('⚠️ TwilioSmsChannel.sendSms called but not implemented yet');
    throw new NotImplementedException('SMS sending is not implemented yet');
  }
}