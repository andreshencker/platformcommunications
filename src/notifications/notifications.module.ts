import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

import { TemplateRendererService } from './template/template-renderer.service';

import { GmailEmailChannel } from './channels/email/gmail-email.channel';
import { TwilioSmsChannel } from './channels/sms/twilio-sms.channel';

import { AuthNotificationsHandler } from './domains/auth/auth-notifications.handler';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,

    // Core
    TemplateRendererService,

    // Channels
    GmailEmailChannel,
    TwilioSmsChannel,

    // Domain handlers
    AuthNotificationsHandler,

  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}