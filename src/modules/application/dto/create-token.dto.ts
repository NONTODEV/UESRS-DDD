import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'token',
  })
  accessToken: string;
}
