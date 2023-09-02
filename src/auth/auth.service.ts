import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RedisService } from '../redis/redis.service';
import { SignUpDto, LogInDto } from './dto';
import { Response } from 'express';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';
import { VerifyOtpDto } from '../redis/dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private redisservice: RedisService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  //SIGNIN
  async signin(loginDto: LogInDto, res: Response) {
    const { username, password } = loginDto;
    const user = await this.prismaService.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) throw new BadRequestException('Username or password wrong');
    const isMatchPassword = await bcrypt.compare(
      password,
      user.hashed_password,
    );
    if (!isMatchPassword)
      throw new BadRequestException('Username or password wrong');

    const tokens = await this.getTokens(user);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 8);
    await this.prismaService.user.update({
      data: {
        hashed_refresh_token,
      },
      where: {
        id: user.id,
      },
    });

    res.cookie('refreshToken', tokens.refresh_token, {
      maxAge: 1800000,
      httpOnly: true,
    });

    return {
      message: 'Successfully signed in',
      tokens,
    };
  }

  //SIGNUP
  async signup(signUpDto: SignUpDto, res: Response) {
    const {
      first_name,
      last_name,
      username,
      login,
      password,
      confirm_password,
    } = signUpDto;

    const conflict = await this.prismaService.user.findFirst({
      where: {
        OR: [
          {
            username: {
              equals: username,
            },
          },
          {
            login: {
              equals: login,
            },
          },
        ],
      },
    });

    if (conflict) {
      throw new BadRequestException('Already registered');
    }

    if (password !== confirm_password) {
      throw new BadRequestException('Passwords not match');
    }

    const hashed_password = await bcrypt.hash(password, 7);

    const newUser = await this.prismaService.user.create({
      data: {
        first_name,
        last_name,
        username,
        login,
        hashed_password,
      },
    });
    const tokens = await this.getTokens(newUser);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 8);
    const uniqueKey: string = v4();

    const updatedUser = await this.prismaService.user.update({
      data: {
        hashed_refresh_token,
        activation_link: uniqueKey,
      },
      where: {
        id: newUser.id,
      },
    });
    res.cookie('refreshToken', tokens.refresh_token, {
      maxAge: 1800000,
      httpOnly: true,
    });

    if (login.includes('@')) {
      try {
        await this.mailService.sendUserConfirmation(updatedUser);
        return {
          message: `We have sent a confirmation link to email: ${updatedUser.login}`,
          tokens,
        };
      } catch (error) {
        await this.prismaService.user.delete({
          where: { id: updatedUser.id },
        });
        throw new InternalServerErrorException('Something went wrong');
      }
    } else {
      const data = await this.redisservice.set({ phone_number: login });
      console.log('data', data);

      return {
        message: `We have sent a one-time-password to phone: ${updatedUser.login}`,
        tokens,
        details: data.details,
      };
    }
  }

  //SIGNOUT
  async signout(id: number, res: Response) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: id,
        hashed_refresh_token: {
          not: null,
        },
      },
    });
    if (!user) throw new ForbiddenException('Access denied');
    await this.prismaService.user.update({
      data: {
        hashed_refresh_token: null,
      },
      where: {
        id: user.id,
      },
    });

    res.clearCookie('refreshToken');
    return {
      statsus: 'ok',
      message: 'Successfully signed out',
      id,
    };
  }

  // VERIFY EMAIL
  async verifyEmail(id: string, res: Response) {
    const user = await this.prismaService.user.findFirst({
      where: {
        activation_link: id,
        is_active: false,
      },
    });
    if (!user) {
      throw new BadRequestException('User is already activated');
    }
    user.is_active = true;
    const tokens = await this.getTokens(user);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 8);

    await this.prismaService.user.update({
      data: {
        is_active: true,
        activation_link: null,
        hashed_refresh_token,
      },
      where: {
        id: user.id,
      },
    });

    res.cookie('refreshToken', tokens.refresh_token, {
      maxAge: 1800000,
      httpOnly: true,
    });
    throw new HttpException(
      { message: 'User successfully activated', tokens },
      HttpStatus.OK,
    );
  }

  // VERIFY OTP
  async verifyOtp(verifyOtpDto: VerifyOtpDto, res: Response) {
    await this.redisservice.verifyOTP(verifyOtpDto);
    const user = await this.prismaService.user.findFirst({
      where: {
        login: verifyOtpDto.check,
        is_active: false,
      },
    });
    if (!user) {
      throw new BadRequestException('User is already activated');
    }
    user.is_active = true;
    const tokens = await this.getTokens(user);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 8);

    await this.prismaService.user.update({
      data: {
        is_active: true,
      },
      where: {
        id: user.id,
      },
    });

    res.cookie('refreshToken', tokens.refresh_token, {
      maxAge: 1800,
      httpOnly: true,
    });

    throw new HttpException(
      { message: 'User successfully activated', tokens },
      HttpStatus.OK,
    );
  }

  //GET TOKENS
  async getTokens(user) {
    const jwPayload = {
      id: user.id,
      is_active: user.is_active,
      is_admin: user.is_admin,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(jwPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  //REFRESH TOKEN
  async refreshToken(UserId: number, refreshToken: string, res: Response) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: UserId,
      },
    });

    if (!user || !user.hashed_refresh_token)
      throw new ForbiddenException('Access denied');

    const isRTMatch = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token,
    );

    if (!isRTMatch) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 8);

    await this.prismaService.user.update({
      data: {
        hashed_refresh_token,
      },
      where: {
        id: user.id,
      },
    });
    res.cookie('refreshToken', tokens.refresh_token, {
      maxAge: 1800000,
      httpOnly: true,
    });
    return tokens;
  }
}
