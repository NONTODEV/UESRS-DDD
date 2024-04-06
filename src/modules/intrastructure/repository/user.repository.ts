import { Injectable } from '@nestjs/common';
import { DB_CONNECTION_NAME } from 'src/constants';
import { Users } from './user/user.schame';
import { createUserDto } from 'src/modules/application/dto/create-users.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoggerService } from 'src/modules/domain/services/logger.service';
import { usersInterface } from './auth/interface/users.interface';
import { updateUserDto } from 'src/modules/application/dto/update-user.dto';

@Injectable()
export class UserRepository {
  private Log: LoggerService = new LoggerService(UserRepository.name);
  @InjectModel(Users.name, DB_CONNECTION_NAME)
  private readonly userModel: Model<Users>;

  constructor() {}

  getUserModel(): Model<Users> {
    return this.userModel;
  }

  async createuser(createUserDto: createUserDto): Promise<Users> {
    return await this.userModel.create(createUserDto);
  }

  async getByEmail(email: string): Promise<usersInterface> {
    return await this.userModel.findOne({ email }).lean();
  }

  async getByUsersname(username: string): Promise<Users> {
    return await this.userModel.findOne({ username }).lean();
  }

  update(userId: string, payload: updateUserDto): Promise<updateUserDto> {
    return this.userModel.findOneAndUpdate(
      { userId },
      { username: payload.username },
    );
  }
}
