import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { NotificationsService } from './notifications.service';
import { GmailEmailChannel } from './channels/email.gmail.channel';

@Module({
    imports: [
        ConfigModule, // opcional si usas ConfigService en GmailEmailChannel
    ],
    providers: [
        NotificationsService,
        GmailEmailChannel,
    ],
    exports: [
        NotificationsService, // 👈 importante para que otros módulos lo puedan usar
    ],
})
export class NotificationsModule {}