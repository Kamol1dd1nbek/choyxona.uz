import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { ValidateNested } from 'class-validator';

export class LogInDto {
  @ApiProperty({
    example: 's@rv@rc1k',
    description: 'User: username',
  })
  @IsString()
  username: string;

  @ApiProperty({ example: 'qwerty', description: 'User: password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
