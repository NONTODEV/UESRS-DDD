import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Context,
  LoggerService,
} from 'src/modules/domain/services/logger.service';
import { loginUserDto } from '../dto/login-user.dto';
import { CreateTokenDTO } from '../dto/create-token.dto';
import { LoginService } from 'src/modules/domain/services/auth.service';
@Controller('users')
@ApiTags('auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  private Log: LoggerService = new LoggerService(AuthController.name);
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  @UseGuards()
  @ApiBody({
    type: loginUserDto,
  })
  @ApiResponse({
    status: 200,
    type: CreateTokenDTO,
  })
  async loginUser(@Body() body: loginUserDto): Promise<CreateTokenDTO> {
    const context: Context = { module: 'AuthController', method: 'createuser' };
    this.Log.logger(context);
    return await this.loginService.login(body);
  }
}
