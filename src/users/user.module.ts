import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controller/user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { Otp, OtpSchema } from './schemas/otp.schema';
import { NotificationService } from 'src/notification/notification.service';
import { MailerService } from '@nestjs-modules/mailer';
import { NotificationModule } from 'src/notification/notification.module';
import { Passport } from 'src/middleware/passport';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    NotificationModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema },
       { name: Otp.name, schema: OtpSchema }]),JwtModule.register({
        secret: process.env.JWT_SECRET
      }),
    PassportModule.register({defaultStrategy: 'jwt'}),
  ],
  controllers: [UserController],
  providers: [UserService, NotificationService, Passport],
  exports:[Passport, UserService]
})
export class UsersModule {}
