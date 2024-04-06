import { Injectable } from '@nestjs/common';
import { createUserDto } from 'src/modules/application/dto/create-users.dto';
import { UserRepository } from 'src/modules/intrastructure/repository/user.repository';
import { Users } from 'src/modules/intrastructure/repository/user/user.schame';
import { LoggerService } from './logger.service';

@Injectable()
export class UserService {
  private readonly logger: LoggerService = new LoggerService(UserService.name);
  constructor(private readonly repository: UserRepository) {}

  async create(createUserDto: createUserDto): Promise<Users> {
    return await this.repository.createuser(createUserDto);
  }
}
