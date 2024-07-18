import { Controller, Get, Post, Body, Patch, Param, Req, Res, Next, HttpStatus, UseGuards } from '@nestjs/common';
import {  UserService } from '../user.service';
import { CreateUserDto, LoginUserDto, SendEmailDto, VerifyEmailDto } from '../dto/user.dto';
import { NextFunction, Request, Response } from 'express';
import { logger } from 'src/utils/logger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserInterface } from '../schemas/user.schema';
import { TokenExpirationGuard } from 'src/middleware/guards/token.expires';

export interface AuthenticatedRequest extends Request {
  user?: UserInterface; 
}

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
    ) {}

  @Post('register')
  async createAccount(@Body() createUserDto: CreateUserDto, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    try {
        const result = await this.userService.registerUser(createUserDto);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      logger.error(error.message, {statusCode: (error.status || 500), route: req.originalUrl, method: req.method, error: error})
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        data: {}
      })
      next(error);
    }

  }

  @Patch('email/verify')
  async verifyPhoneNumber( @Body() data: VerifyEmailDto, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    try {
      const result = await this.userService.verifyEmailOtp(data)
      return res.status(result.statusCode).json(result);
    } catch (error) {
      logger.error(error.message, { statusCode: (error.status || 500), route: req.originalUrl, method: req.method, error: error })
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        data: {}
      })
      next(error);
    }

  }

  @Patch('resend-email')
  @UseGuards(TokenExpirationGuard, AuthGuard('jwt'))
  @ApiBearerAuth('Authorization')
  async resendEmailVerification( @Body() data: SendEmailDto, @Req() req: AuthenticatedRequest, @Res() res: Response, @Next() next: NextFunction) {
    try {
      const userData = req.user
      const result = await this.userService.sendEmailVerificationToken(data, userData);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      logger.error(error.message, { statusCode: (error.status || 500), route: req.originalUrl, method: req.method, error: error })
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        data: {}
      })
      next(error);
    }

  }

  @Post('login')
  async loginUser( @Body() data: LoginUserDto, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    try {
      const result = await this.userService.loginUser(data);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      logger.error(error.message, { statusCode: (error.status || 500), route: req.originalUrl, method: req.method, error: error })
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        data: {}
      })
      next(error);
    }

  }

  
}