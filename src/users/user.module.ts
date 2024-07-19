import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controller/user.controller';
import { UserService } from './services/user.service';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { Otp, OtpSchema } from './schemas/otp.schema';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationModule } from 'src/notification/notification.module';
import { Passport } from 'src/middleware/passport';
import { PassportModule } from '@nestjs/passport';
import { Enterprise, EnterpriseSchema } from './schemas/enterprise.schema';
import { EnterpriseService } from './services/enterprise.service';

@Module({
  imports: [
    NotificationModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema },
       { name: Otp.name, schema: OtpSchema }, { name: Enterprise.name, schema: EnterpriseSchema }]),JwtModule.register({
        secret: process.env.JWT_SECRET
      }),
    PassportModule.register({defaultStrategy: 'jwt'}),
  ],
  controllers: [UserController],
  providers: [UserService, NotificationService, Passport, EnterpriseService],
  exports:[Passport, UserService]
})
export class UsersModule {}
