/* eslint-disable prettier/prettier */
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Request } from 'express';
import { JwtPayload } from '../types/jwtPayload.types';
import { JwtPayloadWithRt } from '../types/jwtPayload.rt.types';



@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies['refreshToken']; // Assuming the cookie name is 'refreshToken'
        }
      ]),
      secretOrKey: 'refreshsecrettoken',
      passReqToCallback: true,
    });
  }


  

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRt {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) throw new ForbiddenException('Refresh token not found in cookies');

    return {
      ...payload,
      refreshToken,
    };
  }
}
