import { Injectable, Logger } from '@nestjs/common';
import { GmailEmailChannel } from './channels/email.gmail.channel';
import { NotificationEvent } from './enums/notification-event.enum';
import { NotificationChannel } from './enums/notification-channel.enum';
import { NotifyEventDto } from './dto/notify-event.dto';
import { NotificationResultDto } from './dto/notification-result.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { join } from 'path';
import { promises as fs } from 'fs';

type EventConfig = {
    channels: NotificationChannel[];       // Por ahora: solo EMAIL
    emailTemplate?: string;                // Ruta de plantilla HTML
    emailSubject?: string;                 // Asunto dinámico de email
};

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    /**
     * Configuración centralizada:
     * Cada evento de AUTH → define:
     * - canales a usar (por ahora solo EMAIL)
     * - plantilla HTML
     * - asunto del correo
     */
    private readonly eventConfig: Record<NotificationEvent, EventConfig> = {
        [NotificationEvent.AUTH_USER_REGISTERED]: {
            channels: [NotificationChannel.EMAIL],
            emailTemplate: 'auth/user-registered.html',
            emailSubject: 'Welcome to the platform!',
        },

        [NotificationEvent.AUTH_PASSWORD_RESET_REQUESTED]: {
            channels: [NotificationChannel.EMAIL],
            emailTemplate: 'auth/password-reset-requested.html',
            emailSubject: 'Password Reset Request',
        },

        [NotificationEvent.AUTH_PASSWORD_CHANGED]: {
            channels: [NotificationChannel.EMAIL],
            emailTemplate: 'auth/password-changed.html',
            emailSubject: 'Your Password Was Changed',
        },

        [NotificationEvent.AUTH_ACCOUNT_LOCKED]: {
            channels: [NotificationChannel.EMAIL],
            emailTemplate: 'auth/account-locked.html',
            emailSubject: 'Your Account Has Been Locked',
        },
        [NotificationEvent.AUTH_ADMIN_CREATED]: {
            channels: [NotificationChannel.EMAIL],
            emailTemplate: 'auth/admin-created.html',
            emailSubject: 'Your Admin Account Is Ready',
        },
        [NotificationEvent.AUTH_ADMIN_PASSWORD_RESET_REQUESTED]: {
            channels: [NotificationChannel.EMAIL],
            emailTemplate: 'auth/admin-password-reset.html',
            emailSubject: 'Admin Password Reset Request',
        },

    };

    constructor(private readonly emailChannel: GmailEmailChannel) {}

    /**
     * Punto de entrada general:
     * notify({ event, email, variables })
     */
    async notify(dto: NotifyEventDto): Promise<NotificationResultDto[]> {
        const config = this.eventConfig[dto.event];

        if (!config) {
            this.logger.warn(`⚠️ No notification config for event ${dto.event}`);
            return [];
        }

        const results: NotificationResultDto[] = [];

        for (const channel of config.channels) {
            if (channel === NotificationChannel.EMAIL && dto.email) {
                const res = await this.handleEmail(dto, config);
                results.push(res);
            }
        }

        return results;
    }

    /* ======================================================
     *                    MÉTODOS EMAIL
     * ====================================================== */

    private async handleEmail(
        dto: NotifyEventDto,
        config: EventConfig,
    ): Promise<NotificationResultDto> {
        if (!config.emailTemplate) {
            return {
                channel: NotificationChannel.EMAIL,
                success: false,
                provider: 'gmail',
                error: 'Missing email template',
            };
        }

        const html = await this.renderEmailTemplate(
            config.emailTemplate,
            dto.variables,
        );

        const payload: SendEmailDto = {
            to: dto.email!,
            subject: config.emailSubject ?? 'Notification',
            html,
        };

        return this.emailChannel.sendEmail(payload);
    }

    /**
     * Lee archivo HTML y reemplaza variables {{variable}}
     */
    private async renderEmailTemplate(
        templateRelativePath: string,
        variables?: Record<string, any>,
    ): Promise<string> {
        // 1) Ruta para desarrollo (usa carpeta src)
        const srcBase = join(
            process.cwd(),
            'src',
            'notifications',
            'templates',
            'email',
        );
        const srcPath = join(srcBase, templateRelativePath);

        // 2) Ruta para producción (usa dist + __dirname)
        const distBase = join(__dirname, 'templates', 'email');
        const distPath = join(distBase, templateRelativePath);

        let fullPath = srcPath;

        // Si el archivo no existe en src, probamos en dist
        try {
            await fs.access(fullPath);
        } catch {
            fullPath = distPath;
        }

        let content = await fs.readFile(fullPath, 'utf8');

        if (variables) {
            content = this.applyVariables(content, variables);
        }

        return content;
    }
    /**
     * Reemplazo simple tipo Handlebars:
     * {{firstName}} → "Andrés"
     */
    private applyVariables(
        template: string,
        variables: Record<string, any>,
    ): string {
        let result = template;
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            result = result.replace(regex, String(value));
        }
        return result;
    }
}