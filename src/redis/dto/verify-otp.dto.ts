import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    example:
      'Zt0MJzEumAViaEaEI2AupM+g7DxMuKfgIHbbtL1xIozu/V/osk4QeY91AhnqSevpgpZ2odbuVU77qaxZvwmEuN2e2Ajusd3OagAYnzJYtcI=',
    description: '| Verification key',
  })
  @IsNotEmpty()
  @IsString()
  verification_key: string;

  @ApiProperty({ example: '1776', description: 'OTP (length: 4)' })
  @IsNotEmpty()
  @IsString()
  otp: number;

  @ApiProperty({ example: '+998991234567', description: 'Phone number' })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  check: string;
}
