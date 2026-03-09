import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { LoyaltyCard } from '../../loyalty/entities/loyalty-card.entity';
import { Notification } from '../../notification/entities/notification.entity';
import { QueueEntry } from '../../queue/entities/queue-entry.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.client)
  @JoinColumn({ name: 'user_id' })
  @Index('idx_client_user_id')
  user: User;

  @Column({ unique: true })
  @Index('idx_client_phone')
  phone: string;

  @Column({ name: 'visit_count', default: 0 })
  visitCount: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => Booking, (booking) => booking.client)
  bookings: Booking[];

  @OneToOne(() => LoyaltyCard, (card) => card.client)
  loyaltyCard: LoyaltyCard;

  @OneToMany(() => Notification, (notification) => notification.client)
  notifications: Notification[];

  @OneToMany(() => QueueEntry, (entry) => entry.client)
  queueEntries: QueueEntry[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}