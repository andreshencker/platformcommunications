// src/notifications/channels/email/gmail-email.channel.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import { IEmailChannel } from './email-channel.interface';
import { SendEmailDto } from '../../dto/send-email.dto';
import { NotificationResultDto } from '../../dto/notification-result.dto';

@Injectable()
export class GmailEmailChannel implements IEmailChannel {
  private readonly logger = new Logger(GmailEmailChannel.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly fromEmail: string;

  constructor(private readonly config: ConfigService) {
    // ============================
    // LEER VARIABLES DE ENTORNO
    // ============================
    const user =
      this.config.get<string>('MAIL_USER') ??
      this.config.get<string>('GMAIL_USER') ??
      process.env.MAIL_USER ??
      process.env.GMAIL_USER;

    const pass =
      this.config.get<string>('MAIL_PASS') ??
      this.config.get<string>('GMAIL_PASS') ??
      process.env.MAIL_PASS ??
      process.env.GMAIL_PASS;

    this.fromEmail =
      this.config.get<string>('MAIL_FROM_EMAIL') ??
      this.config.get<string>('GMAIL_FROM') ??
      user ??
      '';

    // ============================
    // VALIDACIONES
    // ============================
    if (!user || !pass) {
      this.logger.error(
        '❌ MAIL_USER / MAIL_PASS (o GMAIL_USER / GMAIL_PASS) no están configurados. El envío de correos fallará.',
      );
    }

    this.logger.debug(`📧 Gmail user: ${user}`);
    this.logger.debug(
      `🔐 Gmail password length: ${pass ? pass.length : 0}`,
    );
    this.logger.debug(`📨 From email: ${this.fromEmail}`);

    // ============================
    // CREAR TRANSPORTER (GMAIL)
    // ============================
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  // ============================
  // MÉTODO PRINCIPAL DE ENVÍO
  // ============================
  async sendEmail(payload: SendEmailDto): Promise<NotificationResultDto> {
    try {
      await this.transporter.sendMail({
        from: this.fromEmail,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      });

      return {
        channel: 'EMAIL',
        success: true,
        provider: 'gmail',
        error: null,
      };
    } catch (err: any) {
      this.logger.error(
        `❌ Error enviando email a ${payload.to}: ${err?.message}`,
        err?.stack,
      );

      return {
        channel: 'EMAIL',
        success: false,
        provider: 'gmail',
        error: err?.message ?? 'Unknown error',
      };
    }
  }
}