import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from '../application/controller/users.controller';
import { UserRepository } from '../intrastructure/repository/user.repository';
import configuration from '../config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { model } from '../intrastructure/models/model';
import { DB_CONNECTION_NAME } from 'src/constants';
import { LoggerMiddleware } from '../application/middlewere/logger.middleware';
import { AuthController } from '../application/controller/auth.controller';
import { AuthRepository } from '../intrastructure/repository/auth/auth.repository';
import { LoginService } from '../domain/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../domain/guards/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { mongooseModuleAsyncOptions } from '../intrastructure/database/database.provider';
import { UserService } from '../domain/services/create.service';
import { UpdateService } from '../domain/services/update.service';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
    MongooseModule.forFeature(model, DB_CONNECTION_NAME),
  ],
  controllers: [AuthController, UsersController],
  providers: [
    UserRepository,
    LoginService,
    AuthRepository,
    JwtService,
    JwtStrategy,
    UserService,
    UpdateService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(UsersController, AuthController);
  }
}
