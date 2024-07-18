import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import * as dotenv from "dotenv";
import { UserPayload } from "src/users/dto/user.dto";
import { Request } from "express";
import { UserService } from "src/users/user.service";
dotenv.config();

@Injectable()
export class Passport extends PassportStrategy(Strategy){
    constructor(
        private service: UserService
    ){
        super({
            secretOrKey: process.env.JWT_SECRET as string,
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true
        });
    }

    async validate(req: Request, payload: UserPayload, done: VerifiedCallback ): Promise<any>{
        
        const user = await this.service.userModel.findOne({ id: payload.user.id})

        if(!user){
            return done(null, false)
        }

        return done(null, payload.user);
    }
}

