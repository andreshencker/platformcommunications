import { SendEmailDto } from '../dto/send-email.dto';
import { NotificationResultDto } from '../dto/notification-result.dto';

export interface IEmailChannel {
    sendEmail(payload: SendEmailDto): Promise<NotificationResultDto>;
}