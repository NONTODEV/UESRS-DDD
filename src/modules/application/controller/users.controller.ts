import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { createUserDto } from '../dto/create-users.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { registerUserValidationPipe } from 'src/modules/intrastructure/pipes/register-user-validation.pipe';
import { UserRepository } from 'src/modules/intrastructure/repository/user.repository';
import {
  Context,
  LoggerService,
} from 'src/modules/domain/services/logger.service';
import { Users } from 'src/modules/intrastructure/repository/user/user.schame';
import { usersInterface } from 'src/modules/intrastructure/repository/auth/interface/users.interface';
import ReqUser from 'src/modules/domain/decorators/req-user.decorator';
import { JwtAuthGuard } from 'src/modules/domain/guards/jwt-auth.guard';
import { updateUserDto } from '../dto/update-user.dto';
import { updateUserEntities } from 'src/modules/domain/entities/update.entities';
import { UserService } from 'src/modules/domain/services/create.service';
import { UpdateService } from 'src/modules/domain/services/update.service';

@Controller('users')
@ApiTags('user')
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  private Log: LoggerService = new LoggerService(UsersController.name);
  constructor(
    private readonly repository: UserRepository,
    private readonly userService: UserService,
    private readonly updateServiser: UpdateService,
  ) {}

  @Post('')
  @ApiBody({
    type: createUserDto,
  })
  async create(
    @Body(registerUserValidationPipe) body: createUserDto,
  ): Promise<Users> {
    const context: Context = {
      module: 'UsersController',
      method: 'createuser',
    };
    this.Log.logger(context);
    return await this.repository.createuser(body);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getme(@ReqUser() user: usersInterface): Promise<usersInterface> {
    const context: Context = { module: 'UsersController', method: 'getme' };
    this.Log.logger(context);
    return user;
  }

  @Put(':userId')
  @ApiBody({
    type: updateUserDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    type: updateUserEntities,
  })
  async updateUser(
    @ReqUser() user: usersInterface,
    @Body() update: updateUserDto,
  ): Promise<updateUserDto> {
    const context: Context = {
      module: 'UsersController',
      method: 'updateUser',
    };
    this.Log.logger(context);
    return await this.updateServiser.update(user.userId, update);
  }
}
