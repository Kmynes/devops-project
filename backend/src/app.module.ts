import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from "./auth/auth.module";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { JwtModule } from './jwt/jwt.module';
import { appProviders } from './app.providers';

@Module({
  imports: [
    AuthModule, 
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client')
    }), 
    UserModule, 
    JwtModule
  ],
  controllers: [AppController],
  providers: [AppService, ...appProviders],
})
export class AppModule {}
