import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';

dotenv.config();

@Module({
  imports:[
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST as string,
        port: parseInt(process.env.EMAIL_PORT as string),
        secure: true,
        tls: {
              rejectUnauthorized: false
            },
        auth:{
          user: process.env.EMAIL_USERNAME as string,
          pass: process.env.EMAIL_PASSWORD as string,
        },
      },
      defaults: {
        from: `"No Reply" <${process.env.EMAIL_USERNAME as string}>`,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema },
    ]),
    ConfigModule.forRoot(),
    PassportModule.register({defaultStrategy: 'jwt'}),
  ],
  controllers: [],
  providers: [NotificationService],
  exports:[ NotificationService]
})
export class NotificationModule {}
