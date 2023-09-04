import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LogInDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetRedisDto, SetRedisDto, VerifyOtpDto } from '../redis/dto';
import { GetCurrentUserId } from '../common/decorators/get-current-user-id.decorator';
import { Public } from '../common/decorators/public.decorator';
import { RefreshTokenGuard } from '../common/guards';
import { GetCurrentUser } from '../common/decorators/get-current-user.decorator';
import { Active } from '../common/decorators/no-access.decorator';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Active()
  @ApiOperation({ summary: '| LogIn' })
  @Post('signin')
  signin(
    @Body() loginDto: LogInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signin(loginDto, res);
  }

  @Public()
  @Active()
  @ApiOperation({ summary: '| SignUp' })
  @Post('signup')
  signup(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signup(signUpDto, res);
  }

  @ApiOperation({ summary: '| Signout' })
  @Post('signout/:id')
  @HttpCode(HttpStatus.OK)
  signout(
    @GetCurrentUserId() id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signout(id, res);
  }

  @Public()
  @Active()
  @ApiOperation({ summary: '| Verify: email' })
  @Get('activate/:id')
  verifyEmail(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.verifyEmail(id, res);
  }

  @Public()
  @Active()
  @ApiOperation({ summary: '| Verify: otp' })
  @Post('activate/otp')
  verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.verifyOtp(verifyOtpDto, res);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: '| Refresh token' })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @GetCurrentUserId() id: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshToken(id, refreshToken, res);
  }
}
