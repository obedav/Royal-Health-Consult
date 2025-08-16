// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import helmet from 'helmet'; // Changed to default import

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Global prefix
  const apiPrefix = configService.get('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  // Security
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));
  app.use(compression());

  // CORS configuration
  const corsOrigin = configService.get('CORS_ORIGIN');
  if (!corsOrigin) {
    logger.warn('CORS_ORIGIN not set, using default localhost:3000');
  }
  
  app.enableCors({
    origin: corsOrigin || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const nodeEnv = configService.get('NODE_ENV');
  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Royal Health Consult API')
      .setDescription('API documentation for Royal Health Consult - Nigerian Healthcare Platform')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Authentication', 'User authentication endpoints')
      .addTag('Users', 'User management endpoints')
      .addTag('Bookings', 'Appointment booking endpoints')
      .addTag('Nurses', 'Nurse management endpoints')
      .addTag('Payments', 'Payment processing endpoints')
      .addTag('Notifications', 'SMS and email notifications')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    const port = configService.get('PORT', 3001);
    logger.log(`📚 API Documentation available at: http://localhost:${port}/${apiPrefix}/docs`);
  }

  // Trust proxy for production
  if (nodeEnv === 'production') {
    app.set('trust proxy', 1);
  }

  const port = configService.get('PORT', 3001);
  
  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.log('SIGTERM received, shutting down gracefully');
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.log('SIGINT received, shutting down gracefully');
    await app.close();
    process.exit(0);
  });

  await app.listen(port);

  logger.log(`🚀 Royal Health Consult API running on: http://localhost:${port}/${apiPrefix}`);
  logger.log(`🏥 Nigerian Healthcare Platform Backend Started Successfully`);
  logger.log(`🌍 Environment: ${nodeEnv || 'development'}`);
}

bootstrap().catch((error) => {
  Logger.error('❌ Error starting server', error, 'Bootstrap');
  process.exit(1);
});