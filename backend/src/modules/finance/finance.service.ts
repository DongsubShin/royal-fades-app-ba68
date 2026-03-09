import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Commission } from './entities/commission.entity';
import { Booking } from '../booking/entities/booking.entity';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Commission) private commissionRepo: Repository<Commission>
  ) {}

  async processPayment(booking: Booking, amount: number, method: string) {
    const payment = this.paymentRepo.create({
      booking,
      amount,
      paymentMethod: method,
      status: PaymentStatus.SUCCEEDED
    });

    await this.paymentRepo.save(payment);
    await this.calculateCommission(booking);
    
    return payment;
  }

  private async calculateCommission(booking: Booking) {
    const barber = booking.barber;
    const rate = barber.defaultCommissionRate || 40; // Default 40%
    const amount = (Number(booking.totalPrice) * rate) / 100;

    const commission = this.commissionRepo.create({
      barber,
      booking,
      amount,
      rate
    });

    return this.commissionRepo.save(commission);
  }
}