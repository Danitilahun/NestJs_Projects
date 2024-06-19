/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  InternalServerErrorException,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ActivationAccountDto } from './dto/activation.account.dto';
import { SigninAuthDto } from './dto/signin.user.dto';
import { Response } from 'express';
import { ForgotPassword } from './dto/forgot.password.dto';
import { ResetPassword } from './dto/reset.password.dto';
import { RtGuard } from './guard/rt.guards';
import { RegistrationUserDto } from './dto/registration.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('activate')
  @ApiOperation({ summary: 'Activate user account' })
  @ApiResponse({
    status: 200,
    description: 'Account verified successfully',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        message: {
          type: 'string',
          example: 'account verified successfully',
        },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: ActivationAccountDto })
  async activateUser(@Body() dto: ActivationAccountDto, @Res() res: Response) {
    try {
      const tokens = await this.authService.activationAccount(dto, res);

      res.cookie('refresh_token', tokens.refresh_token, { httpOnly: true });

      res.send({ success: true, message: 'account verified successfully' });
    } catch (err: unknown) {
      throw new InternalServerErrorException(err);
    }
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in to user account' })
  @ApiResponse({
    status: 200,
    description: 'Sign-in successful',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        message: {
          type: 'string',
          example: 'Sign-in successful',
        },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: SigninAuthDto })
  signIn(@Body() credentials: SigninAuthDto, @Res() res: Response) {
    return this.authService.signin(credentials, res);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({
    status: 200,
    description: 'Password reset link sent successfully',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        message: {
          type: 'string',
          example: 'Password reset link sent successfully',
        },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: ForgotPassword })
  forgotPassword(@Body() dto: ForgotPassword) {
    return this.authService.forgotPassword(dto);
  }

  //reset password
  @Patch('reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        message: {
          type: 'string',
          example: 'Password reset successful',
        },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: ResetPassword })
  resetPassword(@Body() dto: ResetPassword) {
    return this.authService.resetPassword(dto);
  }

  //logout user
  @UseGuards(RtGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  logout(@Req() request: Request, @Res() response: Response) {
    return this.authService.logout(request, response);
  }

  //Create User
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        message: {
          type: 'string',
          example: 'User registered successfully',
        },
      },
    },
  })
  async createUser(@Body() dto: RegistrationUserDto) {
    try {
      return await this.authService.createUser(dto);
    } catch (err: unknown) {
      throw new InternalServerErrorException(err);
    }
  }
}
