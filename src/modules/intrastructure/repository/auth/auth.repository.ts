import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/modules/domain/services/logger.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateTokenDTO } from 'src/modules/application/dto/create-token.dto';
import { UserRepository } from '../user.repository';
import { Users } from '../user/user.schame';

@Injectable()
export class AuthRepository {
  private Log: LoggerService = new LoggerService(AuthRepository.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userrepository: UserRepository,
  ) {}

  async createToken(email: string): Promise<CreateTokenDTO> {
    const jwtOption: JwtSignOptions = {
      expiresIn: '2day',
      secret: this.configService.get<string>('authentication.secret'),
    };

    const accessToken = await this.jwtService.signAsync({ email }, jwtOption);
    return { accessToken };
  }

  blockUser(email: string): Promise<Users> {
    return this.userrepository
      .getUserModel()
      .findOne({
        email,
      })
      .lean();
  }
}
