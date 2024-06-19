/* eslint-disable prettier/prettier */
import { SetMetadata } from "@nestjs/common";


export const PERMISSIONS_KEY='permissions';
export const RequiredPermission=(...permissions: any[])=>SetMetadata(PERMISSIONS_KEY,permissions)