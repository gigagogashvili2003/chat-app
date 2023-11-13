import { Injectable } from '@nestjs/common';
import { ISendEmailCredentials, MailSender } from '../interfaces';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailSenderService implements MailSender {
  private transporter: nodemailer.Transporter;

  public constructor(private readonly configService: ConfigService) {
    const user = this.configService.get<string>('EMAIL');
    const pass = this.configService.get<string>('EMAIL_PASSWORD');

    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: { user, pass },
    });
  }

  public sendMessage(credentials: ISendEmailCredentials): Promise<any> {
    const { to, message, subject } = credentials;

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL,
      to,
      subject,
      text: message,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
