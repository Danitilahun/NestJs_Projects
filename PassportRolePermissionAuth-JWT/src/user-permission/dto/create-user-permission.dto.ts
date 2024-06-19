/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserPermissionDto {
  @ApiProperty({ description: 'The ID of the user', example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'The ID of the permission',
    example: '0987654321',
  })
  @IsString()
  @IsNotEmpty()
  permissionId: string;
}
