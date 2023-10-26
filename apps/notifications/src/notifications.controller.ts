import { EventPatterns } from '@app/common-lib';
import { MAIL_SENDER_SERVICE, MailSender, sendEmailCredentials } from '@app/notifications-lib';
import { Controller, Get, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationsController {
  constructor(@Inject(MAIL_SENDER_SERVICE) private readonly mailSender: MailSender) {}

  @EventPattern(EventPatterns.SEND_EMAIL)
  public sendEmail(@Payload() credentials: sendEmailCredentials) {
    return this.mailSender.sendMessage(credentials);
  }
}
