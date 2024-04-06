import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UsersEntities {
  @ApiProperty({
    type: String,
    example: 'example@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: 'example123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    type: String,
    example: '1234',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  hashPassword: string;
}
