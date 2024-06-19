/* eslint-disable prettier/prettier */
import { Address } from 'nodemailer/lib/mailer';
import { ApiProperty } from '@nestjs/swagger';

export class sendMailDto {
  @ApiProperty({
    description: 'Sender email address',
    example: 'sender@example.com',
  })
  from?: Address;

  @ApiProperty({
    description: 'Recipient email address',
    example: 'recipient@example.com',
  })
  email: string;

  @ApiProperty({ description: 'Email subject', example: 'Hello World' })
  subject: string;

  @ApiProperty({
    description: 'Email text body',
    example: 'Hello, this is a test email.',
  })
  text?: string;

  @ApiProperty({
    description: 'Email HTML body',
    example: '<p>Hello, this is a test email.</p>',
  })
  html: string;

  @ApiProperty({
    description: 'Placeholder replacement for dynamic content',
    example: '{name}',
  })
  placeholderReplacement?: string;
}

export class sendEmail {
  @ApiProperty({
    description: 'Recipient email address',
    example: 'recipient@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Template name for email content',
    example: 'welcome',
  })
  template: string;

  @ApiProperty({ description: 'Recipient name', example: 'John Doe' })
  name: string;

  @ApiProperty({
    description: 'Email subject',
    example: 'Welcome to our platform',
  })
  subject: string;
}
