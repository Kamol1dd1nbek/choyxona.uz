import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword, Matches } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'Xurshid', description: '| User: first name' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ example: "To'ychiyev", description: '| User: last name' })
  @IsString()
  last_name?: string;

  @ApiProperty({ example: 'xursh1dbek786', description: '| User: username' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: '+998991234567',
    description: '| User: login ( phone number or email )',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^\+998([37/^998([378]{2}|(9[013-57-9]))\d{7}$|^\w+\@([\da-zA-Z\-]{1,}\.){1,}[\da-zA-Z-]{2,6}/,
    { message: 'Email or Phone number wrong' },
  )
  login: string;

  @ApiProperty({ example: '1234qwer', description: '| User: password' })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;

  @ApiProperty({ example: '1234qwer', description: '| User: confirm password' })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  confirm_password: string;
}
