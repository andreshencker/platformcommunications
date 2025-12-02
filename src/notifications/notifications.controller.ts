import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotifyEventDto } from './dto/notify-event.dto';
import { NotificationResultDto } from './dto/notification-result.dto';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notifications: NotificationsService) {}

    // Endpoint genérico para probar un evento
    @Post('event')
    async notifyEvent(
        @Body() dto: NotifyEventDto,
    ): Promise<NotificationResultDto[]> {
        return this.notifications.notify(dto);
    }
}