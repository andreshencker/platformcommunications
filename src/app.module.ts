// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';           // 👈 IMPORT NECESARIO
import { NotificationsModule } from './notifications/notifications.module'; // 👈 IMPORT DEL MÓDULO REAL

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    NotificationsModule,   // 👈 ahora sí funciona
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
