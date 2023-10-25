import { MAIL_SENDER_SERVICE } from '../constatns';
import { nodemailerService } from '../services';

export const mailSenderServiceProvider = {
  provide: MAIL_SENDER_SERVICE,
  useClass: nodemailerService,
};

export const notificationsModuleProviders = [mailSenderServiceProvider];
