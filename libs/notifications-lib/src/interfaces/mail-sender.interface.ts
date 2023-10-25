import { sendEmailCredentials } from './send-email-credentials.interface';

export interface MailSender {
  sendMessage(credentials: sendEmailCredentials): Promise<void>;
}
