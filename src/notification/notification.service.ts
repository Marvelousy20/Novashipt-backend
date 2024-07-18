import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ResponseHandler, responseHandler } from 'src/utils';
import { logger } from 'src/utils/logger';
import { MailerService } from '@nestjs-modules/mailer';
import axios from 'axios';
import * as dotenv from 'dotenv'
dotenv.config()

@Injectable()
export class NotificationService {
    constructor(
        public mailerService: MailerService
    ){}

    async sendMail(from_email: string = process.env.EMAIL_USERNAME, to_email: string, subject: string, template: string, context: object){
        return await this.mailerService.sendMail({
          to: `${to_email}`,
          from: `"Novaship" <${from_email}>`,
          replyTo: `Novaship <${from_email}>`,
          subject: `${subject}`,
          template: `./${template}`,
          context: {
            //logo: "https://res.cloudinary.com/dxjyuax78/image/upload/v1711807762/logo_ceeride_hy2ygk.jpg",
             ...context},
        }).then((info: any) =>{
            if(info){
                // console.log(info)
              return responseHandler({
                  status: true,
                  message: "Sent",
                  data: info,
                  statusCode: HttpStatus.OK
              })
            }
        }).catch((err: any) =>{
            if (err) {
                console.log(err.message)
                return responseHandler({
                    status: false,
                    message: "Failed",
                    data: err,
                    statusCode: HttpStatus.BAD_REQUEST
                })
            }
        })
    }
}
