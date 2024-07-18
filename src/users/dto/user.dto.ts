import { IsString, IsNotEmpty, IsEmail, IsObject, ValidateNested, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    userName: string;
    
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class VerifyEmailDto {
    @IsString()
    @IsNotEmpty()
    token: string;
}

export class SendEmailDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class LoginUserDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export interface UserPayload{
    user: {
        id: string
        fullName: string
        userName: string
        email: string
        phoneNumber: string
        address?: string
        avatar?: string
        gender?: string
        role: string,
        emailVerified?: boolean
        locationData?: object
        accountStatus: string
        exp: any
    }
}