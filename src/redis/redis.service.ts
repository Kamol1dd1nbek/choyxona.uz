import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { OnModuleDestroy } from '@nestjs/common';
import { REDIS_CLIENT, RedisClient } from './redis-client.types';
import * as otpGenerator from 'otp-generator';
import { GetRedisDto, SetRedisDto, VerifyOtpDto } from './dto';
import * as crypto from 'crypto';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private password;
  private iv;
  private ivstring;
  public constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient,
  ) {
    this.password = process.env.crypt_password;
    this.iv = Buffer.from(process.env.iv);
    this.ivstring = this.iv.toString('hex');
  }

  onModuleDestroy() {
    this.redisClient.quit();
  }

  ping() {
    return this.redisClient.ping();
  }

  async set(setRedisDto: SetRedisDto) {
    const { phone_number } = setRedisDto;
    // Generate OTP
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log(phone_number, ' -> ', otp);

    const newOtp = await this.redisClient.set(phone_number, otp, { EX: 150 });

    const details = {
      check: phone_number,
      success: true,
      message: 'OTP is recived',
    };

    const encoded = await this.encode(JSON.stringify(details));
    return {
      status: 'Success',
      details: encoded,
    };
  }

  async get(getRedisDto: GetRedisDto) {
    const retriedValue = await this.redisClient.get(getRedisDto.phone_number);
    return retriedValue;
  }

  async verifyOTP(verifyOtpDto: VerifyOtpDto) {
    const { verification_key, otp, check } = verifyOtpDto;
    let decode;
    try {
      decode = await this.decode(verification_key);
    } catch (error) {
      throw new BadRequestException('Failure');
    }

    let obj = JSON.parse(decode);
    const check_obj = obj.check;

    if (check_obj != check) {
      throw new BadRequestException(
        'OTP was not sent to this particular phone number',
      );
    }

    const result = await this.get({ phone_number: obj.check });
    if (result) {
      console.log('match', typeof otp, typeof result);
      if (+otp === +result) {
        return true;
      } else {
        throw new BadRequestException('OTP Not Matched');
      }
    } else {
      throw new BadRequestException('Bad Request');
    }
  }

  async sha1(input) {
    return crypto.createHash('sha1').update(input).digest();
  }

  async password_derive_bytes(password, salt, iterations, len) {
    let key = Buffer.from(password + salt);
    for (let i = 0; i < iterations; i++) {
      key = await this.sha1(key);
    }
    if (key.length < len) {
      let hx = await this.password_derive_bytes(
        password,
        salt,
        iterations - 1,
        20,
      );
      for (let counter = 1; key.length < len; ++counter) {
        key = Buffer.concat([
          key,
          await this.sha1(Buffer.concat([Buffer.from(counter.toString()), hx])),
        ]);
      }
    }
    return Buffer.alloc(len, key);
  }

  async encode(string) {
    let key = await this.password_derive_bytes(this.password, '', 100, 32);
    let cipher = await crypto.createCipheriv('aes-256-cbc', key, this.ivstring);
    let part1 = cipher.update(string, 'utf8');
    let part2 = cipher.final();
    const encrypted = Buffer.concat([part1, part2]).toString('base64');
    return encrypted;
  }

  async decode(string) {
    let key = await this.password_derive_bytes(this.password, '', 100, 32);
    let decipher = await crypto.createDecipheriv(
      'aes-256-cbc',
      key,
      this.ivstring,
    );
    let decrypted = decipher.update(string, 'base64', 'utf8');
    decrypted += decipher.final();
    return decrypted;
  }
}
