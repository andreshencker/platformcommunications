// src/notifications/notifications.controller.ts
import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { NotifyEventDto } from './dto/notify-event.dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly config: ConfigService,
  ) {}

  @Post('notify')
  @ApiOperation({ summary: 'Disparar una notificación genérica' })
  @ApiBody({ type: NotifyEventDto })
  async notify(
    @Headers('x-api-key') apiKey: string,
    @Body() dto: NotifyEventDto,
  ) {
    const expectedKey = this.config.get<string>('COMMUNICATION_API_KEY');

    if (!apiKey || apiKey !== expectedKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return this.notificationsService.notify(dto);
  }
}