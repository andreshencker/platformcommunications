// src/notifications/dto/send-email.dto.ts
export class SendEmailDto {
  to!: string;
  subject!: string;
  html!: string;
  from?: string;
}