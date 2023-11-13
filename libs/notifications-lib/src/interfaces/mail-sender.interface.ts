import { ISendEmailCredentials } from './send-email-credentials.interface';

export interface MailSender {
  sendMessage(credentials: ISendEmailCredentials): Promise<void>;
}
