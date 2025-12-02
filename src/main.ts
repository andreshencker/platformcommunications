// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// Filtro e interceptor (si los usas)
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // Validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtros globales
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Communication Service')
    .setDescription('Microservicio de comunicación (emails, SMS, plantillas).')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // Puerto
  const port =
    config.get<number>('COMMUNICATION_PORT') ||
    Number(process.env.COMMUNICATION_PORT) ||
    3001;

  await app.listen(port);

  // 📌 ESTE ES EL MENSAJE QUE QUERÍAS (CONSOLE.LOG)

  console.log(`🚀 Communication Service running at: http://localhost:${port}`);
  console.log(`📘 Swagger docs available at: http://localhost:${port}/docs`);

}

bootstrap();