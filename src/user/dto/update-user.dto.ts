import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'Abdusalim', description: 'User: firstname' })
  first_name?: string;

  @ApiProperty({ example: 'Jamshidov', description: 'User: lastname' })
  last_name?: string;

  @ApiProperty({ example: 'uzbBoy', description: 'User: username' })
  username?: string;
}
