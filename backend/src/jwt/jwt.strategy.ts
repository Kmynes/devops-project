import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { Model } from 'mongoose';
import { JwtPlayload } from './interfaces/jwt-playload.interface';
import { User } from '../user/interfaces/user.interface';
import { JwtBlacklistService } from './jwt-blacklist.service';
import { Guard } from './get-guard.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject("USER_MODEL") private readonly userModel:Model<User>,
        @Inject('JWT_RSA_PUBLICKEY') private readonly publicKey:string,
        private readonly jwtBlacklistService:JwtBlacklistService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            algorithms:["RS512"],
            secretOrKeyProvider:(req, token, done) => {                
                done(null, this.publicKey);
            },
            passReqToCallback: true
        });
    }

    async validate(req:Request, payload: JwtPlayload) {
        const authorization = req.headers["Authorization"] || req.headers["authorization"];
        if (typeof authorization === "string") {
            const token = authorization.split(/bearer */i)[1];
            if (!await this.jwtBlacklistService.valideToken(token))
                throw new UnauthorizedException();

            const { email } = payload;
            const user = await this.userModel.findOne({email});

            if (!user)
                throw new UnauthorizedException();
            const guard:Guard = {token, user};
            return guard;
        } else
            throw new UnauthorizedException();
    }
}