import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerServie: MailerService) {}

  async sendUserConfirmation(user): Promise<void> {
    const url = `${process.env.API_HOST}/choy/auth/activate/${user.activation_link}`;
    await this.mailerServie.sendMail({
      to: user.login,
      subject: 'Welcome to Choyxona App! Confirm your Email!',
      template: './confirmation',
      context: {
        name: user.first_name,
        url,
      },
    });
  }
}
