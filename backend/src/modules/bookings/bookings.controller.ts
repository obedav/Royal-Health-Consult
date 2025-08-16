// backend/src/modules/bookings/bookings.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/users.entity';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  async createBooking(
    @Request() req,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return await this.bookingsService.createBooking(req.user.id, createBookingDto);
  }

  @Get('my-bookings')
  @ApiOperation({ summary: 'Get current user bookings' })
  @ApiResponse({ status: 200, description: 'User bookings retrieved successfully' })
  async getMyBookings(@Request() req) {
    return await this.bookingsService.findUserBookings(req.user.id);
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.NURSE)
  @ApiOperation({ summary: 'Get all bookings (Admin/Nurse only)' })
  @ApiResponse({ status: 200, description: 'All bookings retrieved successfully' })
  async getAllBookings() {
    return await this.bookingsService.findAllBookings();
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get booking statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Booking statistics retrieved successfully' })
  async getBookingStats() {
    return await this.bookingsService.getBookingStats();
  }

  @Get('available-nurses')
  @ApiOperation({ summary: 'Get available nurses' })
  @ApiResponse({ status: 200, description: 'Available nurses retrieved successfully' })
  async getAvailableNurses() {
    return await this.bookingsService.getAvailableNurses();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async getBooking(@Param('id') id: string) {
    return await this.bookingsService.findBookingById(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.NURSE)
  @ApiOperation({ summary: 'Update booking (Admin/Nurse only)' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async updateBooking(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return await this.bookingsService.updateBooking(id, updateBookingDto);
  }

  // FIXED CANCEL METHOD
  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiResponse({ status: 400, description: 'Cannot cancel this booking' })
  @ApiResponse({ status: 401, description: 'Not authorized to cancel this booking' })
  async cancelBooking(@Param('id') id: string, @Request() req) {
    console.log('Cancel controller - Received ID:', id);
    console.log('Cancel controller - User ID:', req.user.id);
    
    // Clean the ID - remove any quotes that might be added by Swagger
    const cleanId = id.replace(/['"]/g, '').trim();
    console.log('Cancel controller - Clean ID:', cleanId);
    
    return await this.bookingsService.cancelBooking(cleanId, req.user.id);
  }
}