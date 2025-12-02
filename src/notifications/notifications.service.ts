// src/notifications/notifications.service.ts
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { AuthNotificationsHandler } from './domains/auth/auth-notifications.handler';
import { NotifyEventDto } from './dto/notify-event.dto';
import { NotificationResultDto } from './dto/notification-result.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly authHandler: AuthNotificationsHandler) {}

  /**
   * Punto de entrada general:
   * - Decide a qué dominio pertenece el evento (auth.*, trading.*, etc.)
   * - Delega al handler del dominio.
   */
  async notify(dto: NotifyEventDto): Promise<NotificationResultDto[]> {
    if (!dto.event) {
      throw new BadRequestException('event is required');
    }

    const event = dto.event.trim();

    // De momento solo manejamos AUTH
    if (event.startsWith('auth.')) {
      // 👇 delegamos y NO lanzamos BadRequest dentro del handler
      return this.authHandler.handle(event, dto);
    }

    this.logger.warn(`No handler found for event: ${event}`);
    throw new BadRequestException(`Unsupported event: ${event}`);
  }
}