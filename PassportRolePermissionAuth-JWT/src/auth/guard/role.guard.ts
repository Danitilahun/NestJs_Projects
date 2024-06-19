/* eslint-disable prettier/prettier */

import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "@prisma/client";
import { Observable } from "rxjs";
import { ROLES_KEY } from "src/decorators/role.auth";




@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user= request.user
    // console.log(request.user.role)
    // ['admin', 'lesser'];
const myrole=requiredRoles.some((role) => user.role === role)


console.log(requiredRoles)
console.log((role:any) => {return user.role?.includes(role)})
return myrole;

    // return requiredRoles.some((role) => user.role?.includes(role));
  }
}