import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcrypt';
import { createUserDto } from 'src/modules/application/dto/create-users.dto';
import { CreateUserInterface } from '../repository/user/interface/create-user.interfaces';
import { UserRepository } from '../repository/user.repository';
export class registerUserValidationPipe implements PipeTransform {
  private readonly logger = new Logger(registerUserValidationPipe.name);

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    private readonly userrepository: UserRepository,
  ) {}

  async transform(body: createUserDto): Promise<createUserDto> {
    let userEmail: CreateUserInterface;
    try {
      userEmail = await this.userrepository.getByEmail(body.email);
    } catch (e) {
      this.logger.error(`Error email: ${e?.message ?? JSON.stringify(e)}`);
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }

    if (userEmail) {
      throw new BadRequestException(`Email ${body.email} already exists`);
    }

    let username: CreateUserInterface;
    try {
      username = await this.userrepository.getByUsersname(body.username);
    } catch (e) {
      this.logger.error(`Error username: ${e?.message ?? JSON.stringify(e)}`);
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }

    if (username) {
      throw new BadRequestException(`Email ${body.username} already exists`);
    }

    if (body.password !== body.password) {
      throw new BadRequestException(
        'Password and confirm password do not match.',
      );
    }

    const hashSize = this.configService.get<string>('authentication.hashSize');
    let hashPassword: string;
    try {
      hashPassword = await hash(body.password, hashSize);
    } catch (e) {
      this.logger.error(
        `Error hashing password: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }

    body.password = hashPassword;
    return body;
  }
}
