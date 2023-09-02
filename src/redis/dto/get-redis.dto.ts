import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class GetRedisDto {
  @ApiProperty({ example: '+998991234567', description: 'Phone number' })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  phone_number: string;
}
