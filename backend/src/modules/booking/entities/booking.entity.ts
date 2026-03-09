import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, ManyToMany, JoinTable, JoinColumn, OneToOne, Index } from 'typeorm';
import { Barber } from '../../barber/entities/barber.entity';
import { Client } from '../../client/entities/client.entity';
import { Service } from '../../service/entities/service.entity';
import { Payment } from '../../finance/entities/payment.entity';
import { Commission } from '../../finance/entities/commission.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NOSHOW = 'no_show',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Barber, (barber) => barber.bookings)
  @JoinColumn({ name: 'barber_id' })
  @Index('idx_booking_barber_id')
  barber: Barber;

  @ManyToOne(() => Client, (client) => client.bookings)
  @JoinColumn({ name: 'client_id' })
  @Index('idx_booking_client_id')
  client: Client;

  @Column({ type: 'timestamp', name: 'start_time' })
  @Index('idx_booking_start_time')
  startTime: Date;

  @Column({ type: 'timestamp', name: 'end_time' })
  endTime: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  @Index('idx_booking_status')
  status: BookingStatus;

  @Column({ type: 'decimal', name: 'total_price', precision: 10, scale: 2 })
  totalPrice: number;

  @ManyToMany(() => Service, (service) => service.bookings)
  @JoinTable({
    name: 'booking_services',
    joinColumn: { name: 'booking_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' },
  })
  services: Service[];

  @OneToOne(() => Payment, (payment) => payment.booking)
  payment: Payment;

  @OneToOne(() => Commission, (commission) => commission.booking)
  commission: Commission;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}