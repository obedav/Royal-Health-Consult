// backend/src/modules/auth/dto/auth.dto.ts
import {
  IsEmail,
  IsString,
  IsPhoneNumber,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/entities/users.entity';

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: '+2348012345678' })
  @IsPhoneNumber('NG')
  phone: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, number/special character',
  })
  password: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  confirmPassword: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CLIENT })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({ example: 'male' })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiProperty({ example: 'Lagos' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: 'Lagos' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'en' })
  @IsString()
  @IsOptional()
  preferredLanguage?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  password: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty({ example: 'NewSecurePassword123!' })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, number/special character',
  })
  password: string;

  @ApiProperty({ example: 'NewSecurePassword123!' })
  @IsString()
  confirmPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'CurrentPassword123!' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'NewSecurePassword123!' })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, number/special character',
  })
  newPassword: string;

  @ApiProperty({ example: 'NewSecurePassword123!' })
  @IsString()
  confirmPassword: string;
}

export class VerifyEmailDto {
  @ApiProperty()
  @IsString()
  token: string;
}

export class VerifyPhoneDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

export class ResendVerificationDto {
  @ApiProperty({ enum: ['email', 'phone'] })
  @IsEnum(['email', 'phone'])
  type: 'email' | 'phone';
}

// Response DTOs
export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
  };

  @ApiProperty()
  expiresIn: number;
}

export class MessageResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  success: boolean;
}