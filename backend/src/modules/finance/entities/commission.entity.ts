import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToOne, JoinColumn, Index } from 'typeorm';
import { Barber } from '../../barber/entities/barber.entity';
import { Booking } from '../../booking/entities/booking.entity';

@Entity('commissions')
export class Commission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Barber, (barber) => barber.commissions)
  @JoinColumn({ name: 'barber_id' })
  @Index('idx_commission_barber_id')
  barber: Barber;

  @OneToOne(() => Booking, (booking) => booking.commission)
  @JoinColumn({ name: 'booking_id' })
  @Index('idx_commission_booking_id')
  booking: Booking;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  rate: number;

  @Column({ type: 'timestamp', name: 'paid_at', nullable: true })
  paidAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}