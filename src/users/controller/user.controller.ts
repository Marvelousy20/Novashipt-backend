import { Controller, Get, Post, Body, Patch, Param, Req, Res, Next, HttpStatus, UseGuards, Delete } from '@nestjs/common';
import {  UserService } from '../services/user.service';
import { CreateEnterpriseDto, CreateUserDto, LoginUserDto, SendEmailDto, VerifyEmailDto } from '../dto/user.dto';
import { NextFunction, Request, Response } from 'express';
import { logger } from 'src/utils/logger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserInterface } from '../schemas/user.schema';
import { TokenExpirationGuard } from 'src/middleware/guards/token.expires';
import { EnterpriseService } from '../services/enterprise.service';

export interface AuthenticatedRequest extends Request {
  user?: UserInterface; 
}

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly enterpriseService: EnterpriseService
    ) {}

  @Post('user/register')
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

  @Patch('user/email/verify')
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

  @Patch('user/resend-email')
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

  @Post('user/login')
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

  @Post('enterprise')
  async createEnterprise( @Body() data: CreateEnterpriseDto, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    try {
      const result = await this.enterpriseService.createEnterprise(data)
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

  @Get('enterprise')
  async fetchEnterprise(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    try {
      const result = await this.enterpriseService.fetchEnterprises()
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

  @Get('users')
  async fetchUsers(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    try {
      const result = await this.enterpriseService.fetchUsers()
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

  @Delete('users')
  async purgeUsers(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    try {
      const result = await this.enterpriseService.deleteUsers()
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

  @Delete('enterprises')
  async purgeEnterprise(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    try {
      const result = await this.enterpriseService.deleteEnterprise()
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