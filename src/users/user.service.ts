import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, LoginUserDto, SendEmailDto, VerifyEmailDto } from './dto/user.dto';
import { AccountStatus, User, UserDocument, UserInterface } from './schemas/user.schema';
import { AlphaNumeric, responseHandler, tokenHandler } from 'src/utils';
import { Otp, OtpDocument } from './schemas/otp.schema';
import { NotificationService } from 'src/notification/notification.service';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name)
     public userModel: Model<UserDocument>,
     @InjectModel(Otp.name)
     private otpModel: Model<OtpDocument>,
     @Inject(NotificationService)
     private notification: NotificationService,
    ) {}
 async registerUser(data: CreateUserDto) {

      const checkUser = await this.userModel.findOne({ email: data.email })

      if (checkUser) {
          return responseHandler({
              status: false,
              statusCode: HttpStatus.CONFLICT,
              message: 'User with this credential exists already, please sign in',
              data: {}
          })
      }

      await this.otpModel.deleteMany({ email: data.email } )

      const token = AlphaNumeric(6, 'numeric')

      const Otp = new this.otpModel({
          code: token,
          email: data.email,
          expiresAt: new Date(Date.now() + 86400000)
      })

      await Otp.save();

      const sendEmail = await this.notification.sendMail(
        process.env.EMAIL_USERNAME as string,
        data.email,
        "Novaship-Verify Email",
        'EMAIL_VERIFICATION',
        {
            token: token,
            name: `${data.fullName}`
        }
    )

      if (sendEmail.status === false) {
          return responseHandler({
              status: false,
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              message: 'email could not be sent, please try again later',
              data: {}
          })
      }

      const newUser = new this.userModel({...data})

      await newUser.save();

      const authToken = tokenHandler(newUser, '5m')

      const { email, fullName } = newUser

      return responseHandler({
          status: true,
          statusCode: HttpStatus.CREATED,
          message: 'User account created successfully',
          data: { token: authToken, user: { email, fullName } }
      })

  }


  
  async verifyEmailOtp(data: VerifyEmailDto) {
    const checkToken: Otp = await this.otpModel.findOne({ code: data.token });
  
    if (!checkToken) {
      return responseHandler({
        status: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: "email verified already or not found",
        data: {}
      });
    }
  
    if (checkToken.expiresAt < new Date()) {
      await this.otpModel.deleteOne({ code: data.token });
  
      return responseHandler({
        status: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Token expired",
        data: {}
      });
    }
  
    const user: UserDocument = await this.userModel.findOne({ email: checkToken.email });
  
    if (user && !user.emailVerified) {
      user.emailVerified = true;
      await user.save();
    }
  
    const authToken = tokenHandler(user, '2d');
  
    await this.otpModel.deleteOne({ code: data.token });
  
    return responseHandler({
      status: true,
      statusCode: HttpStatus.OK,
      message: "email verified successfully",
      data: {
        email: checkToken.email,
        token: authToken
      }
    });
  }

  async sendEmailVerificationToken(data: SendEmailDto, user: UserInterface) {
    const { email: userEmail, fullName, emailVerified } = user;

    if (emailVerified === true) {
        return responseHandler({
            status: false,
            statusCode: HttpStatus.BAD_REQUEST,
            message: "Email has been verified already",
            data: {}
        })
    }

    if (userEmail !== data.email) {
        return responseHandler({
            status: false,
            statusCode: HttpStatus.BAD_REQUEST,
            message: "Email was not registered with Novaship, contact support!",
            data: {}
        })
    }

    const token = AlphaNumeric(6, "numeric");

    const newToken = new this.otpModel({
        code: token,
        email: data.email,
        expiresAt: new Date(Date.now() + 86400000)
    })

    await newToken.save();

    await this.notification.sendMail(
        process.env.EMAIL_USERNAME as string,
        data.email,
        "Novaship-Verify Email",
        'EMAIL_VERIFICATION',
        {
            token: token,
            name: `${fullName}`
        }
    )

    console.log(token)

    return responseHandler({
        status: true,
        statusCode: HttpStatus.CREATED,
        message: `Verification link has been resent to ${userEmail}`,
        data: {}
    })

}

async loginUser(data: LoginUserDto) {
    const checkUser = await this.userModel.findOne({ email: data.email });

    if (!checkUser) {
        return responseHandler({
            status: false,
            statusCode: HttpStatus.BAD_REQUEST,
            message: "Invalid email or password",
            data: {}
        })
    }

    const validPassword = await bcrypt.compare(data.password, checkUser.password);

    if (!validPassword) {
        return responseHandler({
            status: false,
            statusCode: HttpStatus.BAD_REQUEST,
            message: "Invalid phone number or password",
            data: {}
        })
    }

    if (checkUser.status == AccountStatus.suspended) {
        return responseHandler({
            status: false,
            statusCode: HttpStatus.BAD_REQUEST,
            message: "Account suspended! Please contact support",
            data: {}
        })
    }

    const { userName, fullName, email, gender, status, emailVerified, role } = checkUser
    const authToken = tokenHandler(checkUser)

    return responseHandler({
        status: true,
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        data: { token: authToken, user: { fullName, userName, email, gender, status, emailVerified, role } }
    })

}
  
}