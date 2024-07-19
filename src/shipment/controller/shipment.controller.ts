import { Controller, Get, Post, Body, Patch, Param, Req, Res, Next, HttpStatus, UseGuards, Delete } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { logger } from 'src/utils/logger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpirationGuard } from 'src/middleware/guards/token.expires';
import { ShipmentService } from '../shipment.service';
import { UserInterface } from 'src/users/schemas/user.schema';
import { CreateShipmentDto, UpdateShipmentLocation, UpdateShipmentProgress, UpdateShipmentStatus } from '../dto/shipment.dto';

export interface AuthenticatedRequest extends Request {
  user?: UserInterface; 
}

@Controller('shipment')
export class ShipmentController {
  constructor(
    private readonly shipmentService: ShipmentService
    ) {}

  @Post()
  async createShipment(@Body() data: CreateShipmentDto, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    try {
        const result = await this.shipmentService.createShipment(data)
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

  @Get(':enterpriseId')
  @UseGuards(TokenExpirationGuard, AuthGuard('jwt'))
  @ApiBearerAuth('Authorization')
  async fetchShipments(@Param('enterpriseId') enterpriseId: string,  @Req() req: AuthenticatedRequest, @Res() res: Response, @Next() next: NextFunction) {
    try {
        const result = await this.shipmentService.fetchShipments(enterpriseId)
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

  @Get('user/list')
  // @UseGuards(TokenExpirationGuard, AuthGuard('jwt'))
  // @ApiBearerAuth('Authorization')
  async fetchMyShipment( @Req() req: AuthenticatedRequest, @Res() res: Response, @Next() next: NextFunction) {
    try {
        //const user = req.user
        const result = await this.shipmentService.fetchMyShipments()
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

  @Get(':trackingId/track')
  // @UseGuards(TokenExpirationGuard, AuthGuard('jwt'))
  // @ApiBearerAuth('Authorization')
  async trackShipment(@Param('trackingId') trackingId: string, @Req() req: AuthenticatedRequest, @Res() res: Response, @Next() next: NextFunction) {
    try {
        //const user = req.user
        const result = await this.shipmentService.trackMyShipments(trackingId)
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

  @Patch(':shipmentId/progress')
  async updateProgress(@Param('shipmentId') shipmentId: string, @Body() data: UpdateShipmentProgress, @Req() req: AuthenticatedRequest, @Res() res: Response, @Next() next: NextFunction) {
    try {
        const result = await this.shipmentService.updateShipmentProgress(shipmentId, data)
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

  @Patch(':shipmentId/status')
  async updateStatus(@Param('shipmentId') shipmentId: string, @Body() data: UpdateShipmentStatus, @Req() req: AuthenticatedRequest, @Res() res: Response, @Next() next: NextFunction) {
    try {
        const result = await this.shipmentService.updateShipmentStatus(shipmentId, data)
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

  @Patch(':shipmentId/location')
  async updateLocation(@Param('shipmentId') shipmentId: string, @Body() data: UpdateShipmentLocation, @Req() req: AuthenticatedRequest, @Res() res: Response, @Next() next: NextFunction) {
    try {
        const result = await this.shipmentService.updateShipmentLocation(shipmentId, data)
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

}