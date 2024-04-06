import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { loginInterface } from 'src/modules/intrastructure/repository/auth/interface/login.interface';
import { UserRepository } from 'src/modules/intrastructure/repository/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authrepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('authentication.secret'),
    });
  }

  async validate(body: loginInterface) {
    const { email } = body;

    const user = await this.authrepository.getByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
