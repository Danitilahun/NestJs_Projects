/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserPermissionDto } from './create-user-permission.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPermissionDto extends PartialType(
  CreateUserPermissionDto,
) {
  @ApiProperty({
    description: 'The updated ID of the user',
    example: '1234567890',
  })
  @IsString()
  @IsOptional()
  userId: string;

  @ApiProperty({
    description: 'The updated ID of the permission',
    example: '0987654321',
  })
  @IsString()
  @IsOptional()
  permissionId: string;
}
