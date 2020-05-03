import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { usersProviders } from './user.providers';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [
    DatabaseModule,
    JwtModule
  ],
  providers:[UserService, ...usersProviders],
  exports:[
    UserService,
    ...usersProviders
  ],
  controllers: [UserController]
})
export class UserModule {}