import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class updateUserDto {
  @ApiProperty({
    type: String,
    example: 'usereiei',
    required: true,
  })
  @IsNotEmpty()
  username: string;
}
