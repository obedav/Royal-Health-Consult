// backend/src/modules/bookings/entities/booking.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum ServiceType {
  HOME_NURSING = 'home_nursing',
  ELDERLY_CARE = 'elderly_care',
  POST_SURGERY_CARE = 'post_surgery_care',
  CHRONIC_DISEASE_MANAGEMENT = 'chronic_disease_management',
  WOUND_CARE = 'wound_care',
  MEDICATION_ADMINISTRATION = 'medication_administration',
  PHYSIOTHERAPY = 'physiotherapy',
  HEALTH_MONITORING = 'health_monitoring',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ServiceType })
  serviceType: ServiceType;

  @Column()
  serviceName: string;

  @Column('text', { nullable: true })
  serviceDescription: string;

  @Column('decimal', { precision: 10, scale: 2 })
  basePrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  // Patient Information
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @Column({ name: 'patient_id' })
  patientId: string;

  // Assigned Nurse
  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'nurse_id' })
  assignedNurse: User;

  @Column({ name: 'nurse_id', nullable: true })
  nurseId: string;

  // Scheduling
  @Column('timestamp')
  scheduledDate: Date;

  @Column()
  scheduledTime: string; // e.g., "09:00 AM"

  @Column({ default: 60 })
  duration: number; // in minutes

  // Location Details
  @Column()
  patientAddress: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column('text', { nullable: true })
  specialInstructions: string;

  // Emergency Contact
  @Column()
  emergencyContactName: string;

  @Column()
  emergencyContactPhone: string;

  // Medical Information
  @Column('text', { nullable: true })
  medicalConditions: string;

  @Column('text', { nullable: true })
  currentMedications: string;

  @Column('text', { nullable: true })
  allergies: string;

  // Payment Information
  @Column({ nullable: true })
  paymentReference: string;

  @Column({ nullable: true })
  paymentMethod: string; // flutterwave, paystack, bank_transfer

  @Column('timestamp', { nullable: true })
  paymentDate: Date;

  // Nigerian-specific fields
  @Column({ default: 'NGN' })
  currency: string;

  @Column({ default: false })
  requiresSpecialEquipment: boolean;

  @Column('text', { nullable: true })
  equipmentNeeded: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Computed properties
  get isUpcoming(): boolean {
    return this.scheduledDate > new Date() && this.status === BookingStatus.CONFIRMED;
  }

  get isPastDue(): boolean {
    return this.scheduledDate < new Date() && this.status === BookingStatus.PENDING;
  }
}