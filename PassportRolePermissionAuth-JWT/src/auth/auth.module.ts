/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailerModule } from 'src/mailer/mailer.module';
import { MailerService } from 'src/mailer/mailer.service';
import { AtStrategy } from './strategy/at.strategy';
import { RtStrategy } from './strategy/rt.strategy';
import { RolesGuard } from './guard/role.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PermissionGuard } from './guard/permission.guard';

@Module({
  imports:[ JwtModule.register({}),MailerModule,JwtModule,PrismaModule],
  providers: [AuthService,JwtService,MailerService,AtStrategy,RtStrategy,RolesGuard,PrismaService,PermissionGuard],
  controllers: [AuthController]
})
export class AuthModule {}
