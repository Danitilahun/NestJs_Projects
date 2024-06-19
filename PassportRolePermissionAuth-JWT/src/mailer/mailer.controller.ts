/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { sendEmail } from './dto/mailer.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('mailer')
@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post()
  @ApiOperation({ summary: 'Send email' })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: sendEmail })
  sendMail(@Body() dto: sendEmail) {
    return this.mailerService.sendMailer(dto);
  }
}
