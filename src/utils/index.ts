import {config} from 'dotenv'
import {Inject, Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common'
//import { Observable, catchError, map } from 'rxjs'
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import {v2 as cloudinary} from 'cloudinary'
import * as jwt from "jsonwebtoken";
import { UserInterface } from 'src/users/schemas/user.schema';

config()
class ResponseHandler{
  status: boolean;
  statusCode: number;
  message: string;
  data: any;
  constructor(status: boolean, statusCode: number, message: string, data: any) {
      this.status = status;
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
  }
}

const responseHandler = (data: ResponseHandler) => {
  return {
      ...data
  }
}


@Injectable()
class CacheService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ){}

    saveToCache = async (body: any, id: any) => {
        await this.cacheManager.set(id.toString(), body, 86400)
    }

    getFromCache = async (id: any): Promise<any> => {
        return await this.cacheManager.get<{name: string}>(id.toString())
    }

    deleteFromCache = async (id: any) => {
        await this.cacheManager.del(id.toString())
    }

}

const verifyPhoneNumber = (phone: string) => {
  return /^([0]{1}|\+?234)([7-9]{1})([0|1]{1})([\d]{1})([\d]{7})$/g.test(phone);
};



@Injectable()
export class TrimPipe implements PipeTransform {
  private isObj(obj: any): boolean {
    return typeof obj === 'object' && obj !== null
  }

  private trim(values: any) {
    Object.keys(values).forEach(key => {
      if (key !== 'password' && key !== 'confirmPassword' && key !== "newPassword") {
        if (this.isObj(values[key])) {
          values[key] = this.trim(values[key])
        } else {
          if (typeof values[key] === 'string') {
            values[key] = values[key].trim()
          }

          if(key === 'phoneNumber' || key === "receiverPhoneNumber"){
            if(!verifyPhoneNumber(values[key])){
              throw new BadRequestException('Invalid phone number')
            }
            if(values[key].startsWith("0")){
              values[key] = values[key].substring(1);
              values[key] = `+234${values[key]}`
            }
            if(values[key].startsWith("234")){
              return `+${values[key]}`
            }
            if(values[key].startsWith("+234")){
              return values[key]
            }

          }
        }
      }

    })
    return values
  }

  transform(values: any, metadata: ArgumentMetadata) {
    const { type } = metadata
    if (this.isObj(values) && type === 'body') {
      return this.trim(values)
    }else{
      return values
    }
  }
}

const tokenHandler = ( data: Partial<UserInterface>, exp?: string) => {
    try {
        const expires = exp?exp:'1yr'
        const jwtOption = {expiresIn: expires}
        const payload = { user: data }
        const token = jwt.sign(payload, process.env.JWT_SECRET, jwtOption)
       return  token

    } catch (error) {
      throw new Error(`Unable to generate token. ${error.message}`);
    }
  };

  cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret : process.env.CLOUD_API_SECRET
  })


  const deleteImage = async (imageId: string):Promise<boolean> => {
      const result = await cloudinary.uploader.destroy(imageId)
      if (result.result === 'ok') {
          return true
      } else {
          return false
      }
  }

  const cloudinaryImage = async (imageId: string):Promise<string> => {
    const url = cloudinary.url(imageId, {secure: true})
    return url
}


const AlphaNumeric = (length: number, type: string = "alphaNumeric") => {
      let result = "";
      const characters = type === "alphaNumeric" ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        : type === "alpha" ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        : "0123456789";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      //ensure alpha-numeric type contains both alphabet and number
      if(type === "alphaNumeric") {
        if(!(/\d/.test(result))){
          return AlphaNumeric(length, type);
        }
      }

      return result;
    };
  

const convertTimeToMinutes = (timeString: string): number | boolean => {
      const parts = timeString.split(' ');
      let hours = 0;
      let minutes = 0;
    
      for (let i = 0; i < parts.length; i += 2) {
        const part = parts[i];
        const quantity = parseInt(part, 10);
    
        if (parts[i + 1] === 'hour' || parts[i + 1] === 'hours' || parts[i + 1] === 'hr' || parts[i + 1] === 'hrs' ) {
          hours = quantity;
        } else if (parts[i + 1] === 'min' || parts[i + 1] === 'mins') {
          minutes = quantity;
        } else {
          return false;
        }
      }
    
      return hours * 60 + minutes;
    }

    const convertDistanceToKilometers = (input: string): number | boolean => {
      const units = {
        km: 1,
        m: 0.001,
      };
    
      const parts = input.split(' ');
      let quantity = 0;
      let unit = '';
    
      if (parts.length === 1) {
        quantity = parseFloat(input);
        unit = 'km';
      } else {
        quantity = parseFloat(parts[0]);
        unit = parts[1];
      }
    
      if (units[unit]) {
        return quantity * units[unit];
      } else {
        return false;
      }
    }


  const getElapsedMinutes = (startTime: Date, endTime: Date): number => {
    const startMillis = startTime.getTime();
    const endMillis = endTime.getTime();
  
    const differenceInMillis = endMillis - startMillis;

    const differenceInMinutes = differenceInMillis / 60000;
  
    // Return the difference in minutes
    return differenceInMinutes;
  }



export{
    responseHandler,
    tokenHandler,
    deleteImage,
    cloudinaryImage,
    AlphaNumeric,
    CacheService,
    ResponseHandler,
    convertTimeToMinutes,
    convertDistanceToKilometers,
    getElapsedMinutes
}
