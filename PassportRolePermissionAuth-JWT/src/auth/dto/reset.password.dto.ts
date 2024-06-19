/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPassword {
  @ApiProperty({
    description: 'The new password for the user account',
    example: 'newPassword123',
  })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @ApiProperty({
    description: 'The confirmed password for the user account',
    example: 'newPassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'The token used for password reset',
    example: 'abcd1234',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
