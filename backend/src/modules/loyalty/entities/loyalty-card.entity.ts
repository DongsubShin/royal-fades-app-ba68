import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, JoinColumn, Index } from 'typeorm';
import { Client } from '../../client/entities/client.entity';

@Entity('loyalty_cards')
export class LoyaltyCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Client, (client) => client.loyaltyCard)
  @JoinColumn({ name: 'client_id' })
  @Index('idx_loyalty_client_id')
  client: Client;

  @Column({ default: 0 })
  points: number;

  @Column({ default: 'Bronze' })
  tier: string;

  @Column({ type: 'jsonb', nullable: true })
  rewards: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}