/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActivationAccountDto {
  @ApiProperty({
    description: 'The activation code for account verification',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  activation_code: string;

  @ApiProperty({
    description: 'The activation token for account verification',
    example: 'abcdef123456',
  })
  @IsString()
  @IsNotEmpty()
  activation_token: string;
}
