// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BookingsModule } from './modules/bookings/bookings.module'; // Add this import

// Import guards
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';

// Import entities
import { User } from './modules/users/entities/users.entity';
import { Booking } from './modules/bookings/entities/booking.entity'; // Add this import

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Database
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => {
      const databaseUrl = configService.get('DATABASE_URL');
      
      // If DATABASE_URL exists (production), use it
      if (databaseUrl) {
        return {
          type: 'postgres',
          url: databaseUrl,
          entities: [User, Booking],
          synchronize: false, // Always false in production
          logging: configService.get('NODE_ENV') === 'development',
          ssl: { rejectUnauthorized: false }, // Required for Render
        };
      }
      
      // Otherwise use individual variables (local development)
      return {
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Booking],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
        ssl: false, // No SSL for local development
      };
    },
    inject: [ConfigService],
  }),

    // Feature modules
    AuthModule,
    UsersModule,
    BookingsModule, // Add BookingsModule here
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global guards
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}