/* eslint-disable prettier/prettier */

import { UserRole } from '../enums/enums';

export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: UserRole;
}
