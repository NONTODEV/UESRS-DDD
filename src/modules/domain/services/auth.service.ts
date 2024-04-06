import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { AuthRepository } from 'src/modules/intrastructure/repository/auth/auth.repository';
import { UserRepository } from 'src/modules/intrastructure/repository/user.repository';
import { loginUserDto } from 'src/modules/application/dto/login-user.dto';
import { CreateTokenDTO } from 'src/modules/application/dto/create-token.dto';

@Injectable()
export class LoginService {
  private readonly logger: LoggerService = new LoggerService(
    LoggerService.name,
  );
  constructor(
    private readonly authrepository: AuthRepository,
    private readonly userrepository: UserRepository,
  ) {}

  async login(body: loginUserDto): Promise<CreateTokenDTO> {
    const { email } = body;
    let createToken: CreateTokenDTO;
    try {
      createToken = await this.authrepository.createToken(email);
    } catch (e) {
      this.logger.error(
        `catch on login-createTokens: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }

    const token = {
      accessToken: createToken.accessToken,
    };

    try {
      await this.userrepository.getUserModel().updateOne(
        {
          email,
        },
        {
          ...token,
        },
      );
    } catch (e) {
      this.logger.error(
        `catch on login-createTokens: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
    return {
      accessToken: createToken.accessToken,
    };
  }
}
