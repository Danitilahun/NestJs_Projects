/* eslint-disable prettier/prettier */
import { AuthGuard } from "@nestjs/passport"

export class AtGuards extends AuthGuard('jwt'){
    constructor(){
        super();
    }
}