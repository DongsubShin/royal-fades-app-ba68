import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { QueueEntry } from '../../queue/entities/queue-entry.entity';
import { Commission } from '../../finance/entities/commission.entity';

@Entity('barbers')
export class Barber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.barber)
  @JoinColumn({ name: 'user_id' })
  @Index('idx_barber_user_id')
  user: User;

  @Column({ type: 'simple-array', nullable: true })
  specialties: string[];

  @Column({ type: 'jsonb', name: 'working_hours', nullable: true })
  workingHours: any;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'decimal', name: 'default_commission_rate', precision: 5, scale: 2, default: 0 })
  defaultCommissionRate: number;

  @OneToMany(() => Booking, (booking) => booking.barber)
  bookings: Booking[];

  @OneToMany(() => QueueEntry, (entry) => entry.barber)
  queueEntries: QueueEntry[];

  @OneToMany(() => Commission, (commission) => commission.barber)
  commissions: Commission[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}