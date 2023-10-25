import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailSender, sendEmailCredentials } from '../interfaces';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class nodemailerService implements MailSender {
  private transporter: nodemailer.Transporter;

  public constructor(private readonly configService: ConfigService) {
    const user = this.configService.get<string>('EMAIL');
    const pass = this.configService.get<string>('EMAIL_PASSWORD');

    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: { user, pass },
    });
  }

  async sendMessage(credentials: sendEmailCredentials): Promise<any> {
    const { to, message, topic } = credentials;

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL,
      to,
      subject: topic,
      text: message,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
