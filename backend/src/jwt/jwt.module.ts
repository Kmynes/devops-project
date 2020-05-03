import { Module } from '@nestjs/common';
import { jwtProviders } from './jwt.providers';
import { JwtStrategy } from './jwt.strategy';
import { JwtBlacklistService } from './jwt-blacklist.service';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from '../user/user.providers';

const passportRegister = PassportModule.register({
    defaultStrategy:'jwt'
});

@Module({
    providers: [
        ...jwtProviders,
        JwtBlacklistService,
        JwtStrategy,
        ...usersProviders
    ],
    imports: [
        passportRegister,
        DatabaseModule,
    ],
    exports: [
        JwtBlacklistService,
        JwtStrategy,
        ...jwtProviders,
        passportRegister
    ]
})
export class JwtModule {}