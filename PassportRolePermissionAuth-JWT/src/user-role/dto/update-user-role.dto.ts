/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserRoleDto } from './create-user-role.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto extends PartialType(CreateUserRoleDto) {
  @ApiProperty({
    description: 'The updated ID of the user',
    example: '1234567890',
  })
  @IsString()
  @IsOptional()
  userId: string;

  @ApiProperty({
    description: 'The updated ID of the role',
    example: '0987654321',
  })
  @IsString()
  @IsOptional()
  roleId: string;
}
