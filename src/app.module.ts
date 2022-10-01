import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppGateway } from './app.gateway';
import configuration from './config/configuration';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
