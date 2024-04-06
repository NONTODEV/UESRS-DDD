import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from 'src/modules/intrastructure/repository/user.repository';
import { UsersController } from '../users.controller';
import { createUserDto } from '../../dto/create-users.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UserRepository],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const mockUser: createUserDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'testpassword',
      hashPassword: 'hashedpassword',
    };

    const spy = jest
      .spyOn(userRepository, 'createuser')
      .mockResolvedValueOnce(mockUser);

    const createdUser = await controller.create(mockUser);

    expect(createdUser).toEqual(mockUser);
    expect(spy).toHaveBeenCalledWith(mockUser);
  });
});
