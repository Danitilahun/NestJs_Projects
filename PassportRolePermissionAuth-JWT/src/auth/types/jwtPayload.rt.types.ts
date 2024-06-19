/* eslint-disable prettier/prettier */

import { JwtPayload } from "./jwtPayload.types";



export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };