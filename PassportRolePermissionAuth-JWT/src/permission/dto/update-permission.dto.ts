/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from './create-permission.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @ApiProperty({
    description: 'The updated action associated with the permission',
    example: 'write',
  })
  @IsString()
  @IsOptional()
  action: string;

  @ApiProperty({
    description: 'The updated role ID associated with the permission',
    example: '654321',
  })
  @IsString()
  @IsOptional()
  roleId: string;
}
