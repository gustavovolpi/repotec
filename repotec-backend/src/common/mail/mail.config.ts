import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const getMailConfig = (configService: ConfigService): MailerOptions => ({
  transport: {
    host: configService.get('MAIL_HOST'),
    port: configService.get('MAIL_PORT'),
    secure: configService.get('MAIL_PORT') === 465,
    auth: {
      user: configService.get('MAIL_USER'),
      pass: configService.get('MAIL_PASS'),
    },
  },
  defaults: {
    from: `"RepoTEC" <${configService.get('MAIL_FROM')}>`,
  },
  template: {
    dir: process.cwd() + '/templates',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
}); 