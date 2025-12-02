// src/notifications/domains/auth/auth-notification.config.ts
import { AuthNotificationEvent } from './auth-notification-events.enum';

export type AuthNotificationChannelConfig = {
  email?: {
    /** Nombre del archivo dentro de domains/auth/templates/email */
    template: string;
    subject: string;
  };
  sms?: {
    /** Nombre del archivo dentro de domains/auth/templates/sms (a futuro) */
    template: string;
  };
};

/**
 * Mapa de EVENTO → configuración por canal (email, sms, etc.).
 */
export const AUTH_NOTIFICATION_CONFIG: Record<
  AuthNotificationEvent,
  AuthNotificationChannelConfig
> = {
  [AuthNotificationEvent.USER_REGISTERED]: {
    email: {
      template: 'user-registered.html',
      subject: 'Welcome to the platform!',
    },
  },

  [AuthNotificationEvent.PASSWORD_RESET_REQUESTED]: {
    email: {
      template: 'password-reset-requested.html',
      subject: 'Password Reset Request',
    },
  },

  [AuthNotificationEvent.PASSWORD_CHANGED]: {
    email: {
      template: 'password-changed.html',
      subject: 'Your password was changed',
    },
  },

  [AuthNotificationEvent.ACCOUNT_LOCKED]: {
    email: {
      template: 'account-locked.html',
      subject: 'Your account has been locked',
    },
  },

  [AuthNotificationEvent.ADMIN_CREATED]: {
    email: {
      template: 'admin-created.html',
      subject: 'Your admin account was created',
    },
  },

  [AuthNotificationEvent.ADMIN_PASSWORD_RESET_REQUESTED]: {
    email: {
      template: 'admin-password-reset.html',
      subject: 'Admin password reset requested',
    },
  },
};