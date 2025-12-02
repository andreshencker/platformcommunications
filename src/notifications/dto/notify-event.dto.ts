// src/notifications/dto/notify-event.dto.ts
import { IsEmail, IsObject, IsOptional, IsString } from 'class-validator';

export class NotifyEventDto {
  @IsString()
  event!: string; // p.e. 'auth.user_registered'

  @IsEmail()
  @IsOptional()
  email?: string; // destinatario email

  @IsString()
  @IsOptional()
  phone?: string; // para SMS en el futuro

  @IsObject()
  @IsOptional()
  variables?: Record<string, any>; // { firstName, resetUrl, ... }
}