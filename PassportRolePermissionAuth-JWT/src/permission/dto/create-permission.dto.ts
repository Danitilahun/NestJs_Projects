/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'The action associated with the permission',
    example: 'read',
  })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({
    description: 'The role ID associated with the permission',
    example: '123456',
  })
  @IsString()
  @IsOptional()
  roleId: string;
}
