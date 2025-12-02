// src/notifications/domains/auth/auth-notifications.handler.ts
import { Injectable, Logger } from '@nestjs/common';
import { AuthNotificationEvent } from './auth-notification-events.enum';
import { TemplateRendererService } from '../../template/template-renderer.service';
import { GmailEmailChannel } from '../../channels/email/gmail-email.channel';
import { NotifyEventDto } from '../../dto/notify-event.dto';
import { NotificationResultDto } from '../../dto/notification-result.dto';

interface AuthNotificationEmailConfig {
  subject: string;
  templatePath: string; // relativo a "domains"
}

interface AuthNotificationConfigItem {
  email?: AuthNotificationEmailConfig;
}

/**
 * Configuración centralizada de eventos AUTH → plantilla + subject
 */
const AUTH_NOTIFICATION_CONFIG: Record<
  AuthNotificationEvent,
  AuthNotificationConfigItem
> = {
  [AuthNotificationEvent.USER_REGISTERED]: {
    email: {
      subject: '¡Bienvenido a JTrade!',
      templatePath: 'auth/templates/email/user-registered.html',
    },
  },
  [AuthNotificationEvent.PASSWORD_RESET_REQUESTED]: {
    email: {
      subject: 'Restablece tu contraseña',
      templatePath: 'auth/templates/email/password-reset-requested.html',
    },
  },
  [AuthNotificationEvent.PASSWORD_CHANGED]: {
    email: {
      subject: 'Tu contraseña ha sido cambiada',
      templatePath: 'auth/templates/email/password-changed.html',
    },
  },
  [AuthNotificationEvent.ACCOUNT_LOCKED]: {
    email: {
      subject: 'Tu cuenta ha sido bloqueada',
      templatePath: 'auth/templates/email/account-locked.html',
    },
  },
  [AuthNotificationEvent.ADMIN_CREATED]: {
    email: {
      subject: 'Tu cuenta de administrador ha sido creada',
      templatePath: 'auth/templates/email/admin-created.html',
    },
  },
  [AuthNotificationEvent.ADMIN_PASSWORD_RESET_REQUESTED]: {
    email: {
      subject: 'Restablece la contraseña de administrador',
      templatePath: 'auth/templates/email/admin-password-reset.html',
    },
  },
};

@Injectable()
export class AuthNotificationsHandler {
  private readonly logger = new Logger(AuthNotificationsHandler.name);

  constructor(
    private readonly templateRenderer: TemplateRendererService,
    private readonly emailChannel: GmailEmailChannel,
  ) {}

  /**
   * Maneja los eventos auth.* y devuelve la lista de resultados por canal.
   * No lanza BadRequest si el evento no está soportado: solo loguea y devuelve [].
   */
  async handle(
    event: string,
    dto: NotifyEventDto,
  ): Promise<NotificationResultDto[]> {
    const typedEvent = event as AuthNotificationEvent;
    const config = AUTH_NOTIFICATION_CONFIG[typedEvent];

    if (!config) {
      this.logger.warn(`Unsupported auth event: ${event}`);
      return [];
    }

    const results: NotificationResultDto[] = [];

    // Solo enviamos email si hay config y dto.email
    if (config.email && dto.email) {
      const html = await this.templateRenderer.render(
        config.email.templatePath,
        dto.variables ?? {},
      );

      const result = await this.emailChannel.sendEmail({
        to: dto.email,
        subject: config.email.subject,
        html,
      });

      results.push(result);
    } else {
      this.logger.warn(
        `Auth event "${event}" has email config but no dto.email provided`,
      );
    }

    return results;
  }
}