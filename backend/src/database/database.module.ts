import { Module } from '@nestjs/common';
import { databaseProviders } from "./databse.providers";

@Module({
    providers: [...databaseProviders],
    exports: [...databaseProviders],
})
export class DatabaseModule {}
