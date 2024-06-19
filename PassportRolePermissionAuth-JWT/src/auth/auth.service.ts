/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import Mail from 'nodemailer/lib/mailer';
import { ActivationAccountDto } from './dto/activation.account.dto';
import * as bcrypt from 'bcryptjs';
import { SigninAuthDto } from './dto/signin.user.dto';
import { JwtPayload } from './types/jwtPayload.types';
import { resetPasswordTemplate } from 'src/mail_templates/resetPassword.template';
import { ResetPassword } from './dto/reset.password.dto';
import { ForgotPassword } from './dto/forgot.password.dto';
import { mailerOption } from 'src/utils/account.verification';
import { MailerService } from 'src/mailer/mailer.service';
import { RegistrationUserDto } from './dto/registration.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  async createActivationToken(email: string) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = await this.jwt.signAsync(
      { email, activationCode },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '5m',
      },
    );
    return { token, activationCode };
  }

  // forgot password

  async forgotPassword(dto: ForgotPassword) {
    const transporter = this.mailerService.mailTransport();

    try {
      const email = dto.email;
      const token = await this.jwt.signAsync(
        { email },
        {
          secret: this.configService.get<string>('FORGOT_PASSWORD'),
          expiresIn: '5m',
        },
      );

      const html = resetPasswordTemplate(
        `http://localhost:3000/resetPassword?token=${token}`,
      );

      const mailerOptions: Mail.Options = {
        from: {
          name: 'Deribew Shimelis',
          address: this.configService.get<string>('SMTP_MAIL'),
        },
        to: dto.email,
        subject: 'Verify Your Email',
        html: html,
      };

      await transporter.sendMail(mailerOptions);

      return {
        success: true,
        message: 'success send to email; and  please reset your password',
        token: token,
      };
    } catch (err) {
      throw err;
    }
  }

  // activation  Account

  async activationAccount(dto: ActivationAccountDto, res: any): Promise<any> {
    try {
      const newUser = await this.jwt.verify(dto.activation_token, {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
      });
      if (!newUser) {
        throw new ForbiddenException('token is expired');
      }

      if (newUser.activationCode !== dto.activation_code) {
        throw new ForbiddenException('Invalid activation code');
      }

      const user = await this.prisma.user.findUnique({
        where: { email: newUser.email },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    select: {
                      action: true,
                    },
                  },
                },
              },
            },
          },
          permissions: {
            select: {
              role: {
                select: {
                  action: true,
                },
              },
            },
          },
        },
      });
      if (!user) {
        throw new ForbiddenException('email not found');
      }

      await this.prisma.user.update({
        where: { email: newUser.email },
        data: {
          emailVerified: new Date(),
        },
      });

      user.roles.forEach((role) => {
        role.role.permissions.forEach((permission) => {
          if (
            !user.permissions.some(
              (existingPermission) =>
                existingPermission.role.action === permission.action,
            )
          ) {
            user.permissions.push({ role: permission });
          }
        });
      });

      const tokens = await this.GetToken(
        user.id,
        user.email,
        user.roles,
        user.permissions,
      );

      await this.prisma.refreshToken.create({
        data: {
          token: tokens.refresh_token,
          userId: user.id,
        },
      });

      res.cookie('refreshToken', tokens.refresh_token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      });

      res.send({
        message: 'Account verfied successfully!',
        accessToken: tokens.access_token,
      });
    } catch (err) {
      throw new ForbiddenException({ success: false, message: err.message });
    }
  }

  // SIGNIN USER

  async signin(dto: SigninAuthDto, res: any): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    select: {
                      action: true,
                    },
                  },
                },
              },
            },
          },
          permissions: {
            select: {
              role: {
                select: {
                  action: true,
                },
              },
            },
          },
        },
      });

      if (!user) throw new ForbiddenException('Credentials are not valid');

      if (!user.emailVerified) {
        const activationToken = await this.createActivationToken(dto.email);
        const transporter = this.mailerService.mailTransport();

        await transporter.sendMail(
          mailerOption(
            dto.email,
            activationToken.activationCode,
            activationToken.token,
          ),
        );

        res.send({
          success: true,
          message: `Account not verified! Please check your email ${dto.email} to verify.`,
          activationToken: activationToken.token,
        });
      }

      // const isMatch = await bcrypt.compare(dto.password, user.password);

      // if (!isMatch) throw new ForbiddenException('Credentials are not valid');
      user.roles.forEach((role) => {
        role.role.permissions.forEach((permission) => {
          if (
            !user.permissions.some(
              (existingPermission) =>
                existingPermission.role.action === permission.action,
            )
          ) {
            user.permissions.push({ role: permission });
          }
        });
      });

      const tokens = await this.GetToken(
        user.id,
        user.email,
        user.roles,
        user.permissions,
      );

      await this.prisma.refreshToken.create({
        data: {
          token: tokens.refresh_token,
          userId: user.id,
        },
      });

      res.cookie('refreshToken', tokens.refresh_token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      });

      res.send({
        message: 'Sign in successful',
        accessToken: tokens.access_token,
      });
    } catch (err) {
      throw new ForbiddenException('Invalid Credentials');
    }
  }

  // LOGOUT

  async logout(request: any, response: any) {
    // Extract refresh token from the cookies
    const refreshToken = request.cookies['refreshToken'];
    // Find the refresh token in the database
    const refreshTokenInDb = await this.prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
      },
    });
    // If refresh token exists in the database, delete it
    if (refreshTokenInDb) {
      await this.prisma.refreshToken.delete({
        where: {
          id: refreshTokenInDb.id,
        },
      });
    }
    // Clear the refresh token cookie
    response.clearCookie('refreshToken');
    // Send response
    response.send({ message: 'You have been logged out successfully' });
  }

  // reset password
  async resetPassword(dto: ResetPassword) {
    try {
      if (dto.password !== dto.confirmPassword) {
        throw new ForbiddenException('password is not match');
      }
      const email = await this.jwt.verify(dto.token, {
        secret: this.configService.get<string>('FORGOT_PASSWORD'),
      });

      if (!email.email) {
        throw new ForbiddenException('token is not valid');
      }

      const user = await this.prisma.user.findUnique({
        where: { email: email.email },
      });

      if (!user) {
        throw new ForbiddenException('email is not exist');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
        },
      });

      return {
        success: true,
        message: 'Your password updated successfully',
      };
    } catch (err) {
      throw err;
    }
  }

  // refresh the Token

  async refreshToken(userId: string, res: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  select: {
                    action: true,
                  },
                },
              },
            },
          },
        },
        permissions: {
          select: {
            role: {
              select: {
                action: true,
              },
            },
          },
        },
      },
    });

    user.roles.forEach((role) => {
      role.role.permissions.forEach((permission) => {
        if (
          !user.permissions.some(
            (existingPermission) =>
              existingPermission.role.action === permission.action,
          )
        ) {
          user.permissions.push({ role: permission });
        }
      });
    });
    const tokens = await this.GetToken(
      user.id,
      user.email,
      user.roles,
      user.permissions,
    );

    await this.prisma.refreshToken.create({
      data: {
        token: tokens.refresh_token,
        userId: user.id,
      },
    });

    res.cookie('refreshToken', tokens.refresh_token, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });

    res.send({
      message: 'token refresh successful',
      accessToken: tokens.access_token,
    });
  }

  async GetToken(
    userId: string,
    email: string,
    roles: any[],
    permissions: any[],
  ) {
    const jwtPayload: JwtPayload = {
      id: userId,
      email: email,
      roles: roles,
      permissions: permissions,
    };

    const [at, rt] = await Promise.all([
      this.jwt.signAsync(jwtPayload, {
        secret: this.configService.get<string>('AT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwt.signAsync(jwtPayload, {
        secret: this.configService.get<string>('RT_SECRET'),
        expiresIn: '1d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  // CREATE USER

  async createUser(dto: RegistrationUserDto): Promise<any> {
    try {
      const existingUser = await this.prisma.user.findFirst({
        where: { email: dto.email },
      });

      if (existingUser && existingUser.emailVerified) {
        throw new ForbiddenException('Email is already taken');
      }

      if (dto.password !== dto.retypePassword) {
        throw new ForbiddenException('password not match');
      }

      const transporter = this.mailerService.mailTransport();
      const activationToken = await this.createActivationToken(dto.email);

      if (existingUser && !existingUser.emailVerified) {
        await transporter.sendMail(
          mailerOption(
            dto.email,
            activationToken.activationCode,
            activationToken.token,
          ),
        );

        return {
          success: true,
          message: `Account not Verify! Please check your email ${dto.email} to verify and ${activationToken.activationCode}`,
          activationToken: activationToken.token,
        };
      } else {
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        await this.prisma.user.create({
          data: {
            name: dto.full_name,
            email: dto.email,
            password: hashedPassword,
          },
        });
        await transporter.sendMail(
          mailerOption(
            dto.email,
            activationToken.activationCode,
            activationToken.token,
          ),
        );

        return {
          success: true,
          message: `Acount Create Success! Please check your email  to verify${dto.email} and ${activationToken.activationCode}`,
          activationToken: activationToken.token,
        };
      }
    } catch (err) {
      console.log(err);
      throw err; // Rethrow the error to handle it elsewhere if necessary
    }
  }
}
