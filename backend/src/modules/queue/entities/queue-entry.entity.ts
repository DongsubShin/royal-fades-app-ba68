import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Client } from '../../client/entities/client.entity';
import { Barber } from '../../barber/entities/barber.entity';

export enum QueueStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('queue_entries')
export class QueueEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client, (client) => client.queueEntries)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Barber, (barber) => barber.queueEntries)
  @JoinColumn({ name: 'barber_id' })
  barber: Barber;

  @Column({ type: 'int' })
  position: number;

  @Column({
    type: 'enum',
    enum: QueueStatus,
    default: QueueStatus.WAITING,
  })
  @Index('idx_queue_status')
  status: QueueStatus;

  @Column({ name: 'estimated_wait_minutes', default: 0 })
  estimatedWaitMinutes: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}