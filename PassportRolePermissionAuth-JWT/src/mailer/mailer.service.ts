/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { TransportOptions } from 'nodemailer';
import { sendEmail } from './dto/mailer.dto';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  mailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<string>('SMTP_PORT'),
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: this.configService.get<string>('SMTP_MAIL'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    } as TransportOptions); // Add type assertion here
    return transporter;
  }

  async sendMailer(dto: sendEmail) {
    const transporter = this.mailTransport();
    const mailerOptions: Mail.Options = {
      from: {
        name: 'Deribew Shimelis',
        address: this.configService.get<string>('SMTP_MAIL'),
      },
      to: dto.email,
      subject: 'verify your email',
      html: `<div> 
      <h1>Verify your Email</h1>
      <p>Please click the link below to verify your email</p>
      <a href="http://" target="_blank">Verify your Email</a>
      </div>`,
    };

    try {
      await transporter.sendMail(mailerOptions);

      return { success: 'success' };
    } catch (err) {
      console.log(err);
    }
  }
}
