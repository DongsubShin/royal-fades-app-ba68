import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationStatus, NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification) private notificationRepo: Repository<Notification>
  ) {}

  async scheduleReminder(clientId: string, message: string, scheduledAt: Date) {
    const notification = this.notificationRepo.create({
      client: { id: clientId },
      message,
      scheduledAt,
      type: NotificationType.SMS,
      status: NotificationStatus.SCHEDULED
    });

    return this.notificationRepo.save(notification);
  }

  // Cron job would call this
  async sendPendingNotifications() {
    const pending = await this.notificationRepo.find({
      where: { status: NotificationStatus.SCHEDULED }
    });

    for (const note of pending) {
      try {
        this.logger.log(`Sending SMS to client: ${note.message}`);
        // Integration with Twilio/SNS would go here
        note.status = NotificationStatus.SENT;
        note.sentAt = new Date();
      } catch (e) {
        note.status = NotificationStatus.FAILED;
      }
      await this.notificationRepo.save(note);
    }
  }
}