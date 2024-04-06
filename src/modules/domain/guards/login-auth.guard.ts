import {
  ExecutionContext,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { Cache } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AuthRepository } from 'src/modules/intrastructure/repository/auth/auth.repository';
import { usersInterface } from 'src/modules/intrastructure/repository/auth/interface/users.interface';
import { UserRepository } from 'src/modules/intrastructure/repository/user.repository';
import { loginUserDto } from 'src/modules/application/dto/login-user.dto';

@Injectable()
export class LoginAuthGuard extends AuthGuard('local') {
  private readonly logger = new Logger(LoginAuthGuard.name);
  constructor(
    private readonly authrepository: AuthRepository,
    private readonly userrepository: UserRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const body = plainToInstance(loginUserDto, request.body);

    let user: usersInterface;
    try {
      user = await this.userrepository.getByEmail(body.email);
    } catch (e) {
      this.logger.error(e?.message ?? JSON.stringify(e));
      throw new InternalServerErrorException({
        message: e?.message ?? JSON.stringify(e),
      });
    }

    if (!user) {
      throw new UnprocessableEntityException('Not Found User.');
    }

    const blockUser = await this.authrepository.blockUser(user.email);
    if (blockUser) {
      throw new UnauthorizedException(`This account ${body.email} benned!`);
    }

    const counter: number =
      (await this.cacheManager.get(`login-failures:${user.email}`)) || 0;

    if (counter >= 3) {
      throw new UnauthorizedException(
        'Login blocked due to too many failed attempts',
      );
    }

    const matchPassword = await bcrypt.compare(body.password, user.password);
    if (!matchPassword) {
      await this.cacheManager.set(
        `login-failures:${user.email}`,
        counter + 1,
        1000,
      );
      throw new UnprocessableEntityException(
        `Password are not valid ${counter + 1}.`,
      );
    }

    await this.cacheManager.del(`login-failures:${user.email}`);

    return true;
  }
}
