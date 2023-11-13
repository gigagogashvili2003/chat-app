import { MailSubjects } from '../enums';

export interface ISendEmailCredentials {
  to: string;
  subject: MailSubjects;
  message: string;
}
