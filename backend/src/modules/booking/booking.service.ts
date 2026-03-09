import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Service } from '../service/entities/service.entity';
import { Barber } from '../barber/entities/barber.entity';
import { Client } from '../client/entities/client.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
    @InjectRepository(Barber) private barberRepo: Repository<Barber>,
    @InjectRepository(Client) private clientRepo: Repository<Client>,
  ) {}

  async create(dto: CreateBookingDto): Promise<Booking> {
    const barber = await this.barberRepo.findOneBy({ id: dto.barberId });
    const client = await this.clientRepo.findOneBy({ id: dto.clientId });
    const services = await this.serviceRepo.findBy({ id: In(dto.serviceIds) });

    if (!barber || !client || services.length === 0) {
      throw new BadRequestException('Invalid barber, client, or services');
    }

    const totalDuration = services.reduce((acc, s) => acc + s.duration, 0);
    const totalPrice = services.reduce((acc, s) => acc + Number(s.price), 0);
    
    const startTime = new Date(dto.startTime);
    const endTime = new Date(startTime.getTime() + totalDuration * 60000);

    // Check availability (simplified)
    const conflict = await this.bookingRepo.findOne({
      where: {
        barber: { id: barber.id },
        status: In([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
        startTime: startTime, // In production, use Overlap logic
      }
    });

    if (conflict) throw new BadRequestException('Barber is busy at this time');

    const booking = this.bookingRepo.create({
      barber,
      client,
      services,
      startTime,
      endTime,
      totalPrice,
      status: BookingStatus.PENDING,
    });

    return this.bookingRepo.save(booking);
  }

  async findAll() {
    return this.bookingRepo.find({ relations: ['barber', 'client', 'services'] });
  }

  async updateStatus(id: string, status: BookingStatus) {
    const booking = await this.bookingRepo.findOneBy({ id });
    if (!booking) throw new NotFoundException('Booking not found');
    booking.status = status;
    return this.bookingRepo.save(booking);
  }
}