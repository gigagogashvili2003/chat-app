import { MAIL_SENDER_SERVICE } from '../constatns';
import { MailSenderService } from '../services';

export const notificationsProviders = [
  {
    provide: MAIL_SENDER_SERVICE,
    useValue: MailSenderService,
  },
];
