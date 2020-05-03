import { Inject } from "@nestjs/common";
import { RedisClient } from "redis";
import * as jwt from "jsonwebtoken";

export class JwtBlacklistService {
    constructor(
        @Inject("REDIS_CONNECTION") 
            private readonly client:RedisClient,
        @Inject("HASH_JWT_TOKEN_BLACKLIST")
            private readonly hashJwtTokenBlacklist:string) {}

    private async isBlacklistedToken(token:string):Promise<boolean> {
        const payload = jwt.decode(token) as any;
        return new Promise((resolve, reject) => {
            if (!this.client.HEXISTS(
                this.hashJwtTokenBlacklist, 
                payload.jti, (err, num) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(num === 1);
                }))
                reject();
        });
    }

    async valideToken(token:string):Promise<boolean> {
        const isBadToken = await this.isBlacklistedToken(token);
        return !isBadToken;
    }

    addToken(token:string):void {
        const payload = jwt.decode(token) as any;
        this.client.hset(this.hashJwtTokenBlacklist, payload.jti, token);
    }
}