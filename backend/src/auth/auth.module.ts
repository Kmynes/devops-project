import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthController } from "./auth.controller";
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [ 
    JwtModule,
    UserModule,
    DatabaseModule
  ],
  controllers: [AuthController],
  providers: [ 
    AuthService
  ]
})
export class AuthModule {}