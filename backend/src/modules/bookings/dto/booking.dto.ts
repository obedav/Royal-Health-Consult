// backend/src/modules/bookings/dto/booking.dto.ts
import { IsEnum, IsString, IsNumber, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { ServiceType, BookingStatus, PaymentStatus } from '../entities/booking.entity';

export class CreateBookingDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsString()
  serviceName: string;

  @IsOptional()
  @IsString()
  serviceDescription?: string;

  @IsNumber()
  basePrice: number;

  @IsNumber()
  totalPrice: number;

  @IsDateString()
  scheduledDate: string;

  @IsString()
  scheduledTime: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsString()
  patientAddress: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @IsString()
  emergencyContactName: string;

  @IsString()
  emergencyContactPhone: string;

  @IsOptional()
  @IsString()
  medicalConditions?: string;

  @IsOptional()
  @IsString()
  currentMedications?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  requiresSpecialEquipment?: boolean;

  @IsOptional()
  @IsString()
  equipmentNeeded?: string;
}

export class UpdateBookingDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsUUID()
  nurseId?: string;

  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @IsOptional()
  @IsString()
  scheduledTime?: string;

  @IsOptional()
  @IsString()
  paymentReference?: string;

  @IsOptional()
  @IsString()
  specialInstructions?: string;
}