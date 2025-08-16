// backend/src/modules/users/entities/users.entity.ts - Clean Fixed Version
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  CLIENT = 'client',
  NURSE = 'nurse',
  ADMIN = 'admin',
}

export enum UserStatus {
  PENDING_VERIFICATION = 'pending_verification',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  INACTIVE = 'inactive',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  nationalId: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: true })
  isEmailVerified: boolean;

  @Column({ default: true })
  isPhoneVerified: boolean;

  @Column({ nullable: true })
  @Exclude()
  emailVerificationToken: string;

  @Column({ nullable: true })
  @Exclude()
  phoneVerificationCode: string;

  @Column({ nullable: true })
  @Exclude()
  passwordResetToken: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpires: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @Column({ default: 0 })
  loginAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lockUntil: Date;

  @Column({ nullable: true })
  emergencyContactName: string;

  @Column({ nullable: true })
  emergencyContactPhone: string;

  @Column({ default: 'en' })
  preferredLanguage: string;

  @Column({ type: 'text', nullable: true })
  medicalHistory: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Hash password before saving (only on insert)
  @BeforeInsert()
  async hashPasswordOnInsert() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  // Only hash password on update if it's been modified and not already hashed
  @BeforeUpdate()
  async hashPasswordOnUpdate() {
    if (this.password && !this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  // Compare password method
  async comparePassword(candidatePassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      console.error('Password comparison error:', error);
      return false;
    }
  }

  // Check if account is locked
  get isLocked(): boolean {
    return !!(this.lockUntil && this.lockUntil > new Date());
  }

  // Increment login attempts
  incrementLoginAttempts(): void {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < new Date()) {
      this.loginAttempts = 1;
      this.lockUntil = null;
    } else {
      this.loginAttempts += 1;
      
      // Lock account after 5 failed attempts for 2 hours
      if (this.loginAttempts >= 5 && !this.isLocked) {
        this.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
      }
    }
  }

  // Reset login attempts
  resetLoginAttempts(): void {
    this.loginAttempts = 0;
    this.lockUntil = null;
  }

  // Get full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Check if user is adult (18+)
  get isAdult(): boolean {
    if (!this.dateOfBirth) return true;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  }
}