// backend/src/modules/bookings/bookings.service.ts
import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus, PaymentStatus } from './entities/booking.entity';
import { User, UserRole, UserStatus } from '../users/entities/users.entity';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createBooking(patientId: string, createBookingDto: CreateBookingDto): Promise<Booking> {
    // Verify patient exists
    const patient = await this.userRepository.findOne({ where: { id: patientId } });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Create booking
    const booking = this.bookingRepository.create({
      ...createBookingDto,
      patientId,
      scheduledDate: new Date(createBookingDto.scheduledDate),
    });

    return await this.bookingRepository.save(booking);
  }

  async findUserBookings(userId: string): Promise<Booking[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If nurse, find assigned bookings; if patient, find their bookings
    if (user.role === UserRole.NURSE) {
      return await this.bookingRepository.find({
        where: { nurseId: userId },
        relations: ['patient', 'assignedNurse'],
        order: { scheduledDate: 'ASC' },
      });
    } else {
      return await this.bookingRepository.find({
        where: { patientId: userId },
        relations: ['patient', 'assignedNurse'],
        order: { scheduledDate: 'DESC' },
      });
    }
  }

  async findAllBookings(): Promise<Booking[]> {
    return await this.bookingRepository.find({
      relations: ['patient', 'assignedNurse'],
      order: { createdAt: 'DESC' },
    });
  }

  async findBookingById(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ 
      where: { id },
      relations: ['patient', 'assignedNurse'],
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async updateBooking(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findBookingById(id);

    // If assigning a nurse, verify nurse exists and is available
    if (updateBookingDto.nurseId) {
      const nurse = await this.userRepository.findOne({
        where: { id: updateBookingDto.nurseId, role: UserRole.NURSE },
      });
      if (!nurse) {
        throw new BadRequestException('Nurse not found or invalid role');
      }
    }

    // Update booking
    Object.assign(booking, updateBookingDto);
    if (updateBookingDto.scheduledDate) {
      booking.scheduledDate = new Date(updateBookingDto.scheduledDate);
    }

    return await this.bookingRepository.save(booking);
  }

  // FIXED CANCEL METHOD
  async cancelBooking(id: string, userId: string): Promise<Booking> {
    try {
      console.log('=== CANCEL BOOKING ===');
      console.log('Booking ID:', id);
      console.log('User ID:', userId);

      // Find the booking with relations
      const booking = await this.bookingRepository.findOne({
        where: { id },
        relations: ['patient', 'assignedNurse'],
      });

      if (!booking) {
        console.log('❌ Booking not found');
        throw new NotFoundException('Booking not found');
      }

      console.log('✅ Booking found:', {
        id: booking.id,
        status: booking.status,
        patientId: booking.patientId,
      });

      // Check authorization - patient can cancel their own, admin can cancel any
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isOwner = booking.patientId === userId;
      const isAdmin = user.role === UserRole.ADMIN;

      if (!isOwner && !isAdmin) {
        console.log('❌ Access denied - not booking owner or admin');
        throw new UnauthorizedException('You can only cancel your own bookings');
      }

      // Check if booking can be cancelled
      if (booking.status === BookingStatus.CANCELLED) {
        console.log('❌ Already cancelled');
        throw new BadRequestException('Booking is already cancelled');
      }

      if (booking.status === BookingStatus.COMPLETED) {
        console.log('❌ Cannot cancel completed booking');
        throw new BadRequestException('Cannot cancel a completed booking');
      }

      // Optional: Check if it's too late to cancel (business rule)
      const scheduledDateTime = new Date(booking.scheduledDate);
      const now = new Date();
      const hoursDifference = (scheduledDateTime.getTime() - now.getTime()) / (1000 * 3600);

      if (hoursDifference < 2 && scheduledDateTime > now) {
        console.log('❌ Too late to cancel - less than 2 hours before appointment');
        throw new BadRequestException('Cannot cancel booking less than 2 hours before scheduled time');
      }

      // Update booking status
      booking.status = BookingStatus.CANCELLED;
      booking.updatedAt = new Date();

      const updatedBooking = await this.bookingRepository.save(booking);

      console.log('✅ Booking cancelled successfully');

      return updatedBooking;
    } catch (error) {
      console.error('Cancel booking error:', error);
      
      // Re-throw known errors
      if (error instanceof NotFoundException || 
          error instanceof UnauthorizedException || 
          error instanceof BadRequestException) {
        throw error;
      }
      
      // Handle unexpected errors
      throw new InternalServerErrorException('Failed to cancel booking');
    }
  }

  async getAvailableNurses(): Promise<User[]> {
    return await this.userRepository.find({
      where: { role: UserRole.NURSE, status: UserStatus.ACTIVE },
      select: ['id', 'firstName', 'lastName', 'email', 'phone'],
    });
  }

  async getBookingStats(): Promise<any> {
    const [total, pending, confirmed, completed, cancelled] = await Promise.all([
      this.bookingRepository.count(),
      this.bookingRepository.count({ where: { status: BookingStatus.PENDING } }),
      this.bookingRepository.count({ where: { status: BookingStatus.CONFIRMED } }),
      this.bookingRepository.count({ where: { status: BookingStatus.COMPLETED } }),
      this.bookingRepository.count({ where: { status: BookingStatus.CANCELLED } }),
    ]);

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      revenue: await this.calculateRevenue(),
    };
  }

  private async calculateRevenue(): Promise<number> {
    const result = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('SUM(booking.totalPrice)', 'revenue')
      .where('booking.paymentStatus = :status', { status: PaymentStatus.PAID })
      .getRawOne();

    return parseFloat(result.revenue) || 0;
  }
}