import { Injectable } from '@nestjs/common';
import { updateUserDto } from 'src/modules/application/dto/update-user.dto';
import { UserRepository } from 'src/modules/intrastructure/repository/user.repository';
import { LoggerService } from './logger.service';

@Injectable()
export class UpdateService {
  private readonly logger: LoggerService = new LoggerService(
    UpdateService.name,
  );
  constructor(private readonly usersRepository: UserRepository) {}

  async update(userId: string, payload: updateUserDto): Promise<updateUserDto> {
    return await this.usersRepository.update(userId, payload);
  }
}
