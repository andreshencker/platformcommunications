// src/notifications/channels/email/email-channel.interface.ts
import { SendEmailDto } from '../../dto/send-email.dto';
import { NotificationResultDto } from '../../dto/notification-result.dto';

/**
 * Contrato que cualquier canal de EMAIL debe implementar.
 */
export interface IEmailChannel {
  sendEmail(payload: SendEmailDto): Promise<NotificationResultDto>;
}