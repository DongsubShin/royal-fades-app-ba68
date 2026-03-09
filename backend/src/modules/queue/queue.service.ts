import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueueEntry, QueueStatus } from './entities/queue-entry.entity';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(QueueEntry) private queueRepo: Repository<QueueEntry>
  ) {}

  async addToQueue(clientId: string, barberId?: string) {
    const lastEntry = await this.queueRepo.findOne({
      where: { status: QueueStatus.WAITING },
      order: { position: 'DESC' }
    });

    const position = lastEntry ? lastEntry.position + 1 : 1;
    const estimatedWait = position * 20; // 20 mins per person avg

    const entry = this.queueRepo.create({
      client: { id: clientId },
      barber: barberId ? { id: barberId } : null,
      position,
      estimatedWaitMinutes: estimatedWait,
      status: QueueStatus.WAITING
    });

    return this.queueRepo.save(entry);
  }

  async getLiveQueue() {
    return this.queueRepo.find({
      where: { status: QueueStatus.WAITING },
      order: { position: 'ASC' },
      relations: ['client', 'barber']
    });
  }
}