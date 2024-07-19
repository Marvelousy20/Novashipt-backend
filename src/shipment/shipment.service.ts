import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shipment, ShipmentDocument } from './schemas/shipment.schema';
import { User, UserDocument, UserInterface } from 'src/users/schemas/user.schema';
import { Enterprise, EnterpriseDocument } from 'src/users/schemas/enterprise.schema';
import { CreateShipmentDto, UpdateShipmentLocation, UpdateShipmentProgress, UpdateShipmentStatus } from './dto/shipment.dto';
import { AlphaNumeric, cloudinaryImage, responseHandler } from 'src/utils';
import { UserPayload } from 'src/users/dto/user.dto';

@Injectable()
export class ShipmentService {

  constructor(
    @InjectModel(Shipment.name)
     public shipmentModel: Model<ShipmentDocument>,
     @InjectModel(User.name)
     private userModel: Model<UserDocument>,
     @InjectModel(Enterprise.name)
     private enterpriseModel: Model<EnterpriseDocument>,
    ) {}

    //create shipment
    async createShipment(data: CreateShipmentDto){
        const checkExistingUser = await this.userModel.findById(data.userId)
        if(!checkExistingUser){
            return responseHandler({
                status: false,
                statusCode: HttpStatus.BAD_REQUEST,
                message: "User with this id does not exist",
                data: {}
              });
        }

        const checkExistingEnterpise = await this.enterpriseModel.findById(data.enterpriseId)
        if(!checkExistingEnterpise){
            return responseHandler({
                status: false,
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Enterprise with this id does not exist",
                data: {}
              });
        }

        const trackingId = AlphaNumeric(16, 'alphaNumeric')

        const newShipment = new this.shipmentModel({trackingId, ...data})

        await newShipment.save();

        return responseHandler({
            status: true,
            statusCode: HttpStatus.CREATED,
            message: 'Shipment created',
            data: {newShipment }
        })

    }

    async fetchMyShipments(){
        //const { id } = user
        const shipments = await this.shipmentModel.find({ userId: '669ac576763192cb88e50385' }).populate('enterpriseId');
        if (shipments.length > 0){
            for (let i = 0; i < shipments.length; i++) {
                const shipment: any = shipments[i];
                shipment.enterpriseId.logo = await cloudinaryImage(shipment.enterpriseId.logo)
            }
        }

        return responseHandler({
            status: true,
            statusCode: HttpStatus.OK,
            message: 'Shipments fetched',
            data: { shipments }
        })

    }

    async trackMyShipments( trackingId: string){
        //const { id } = user

        const checkUser = await this.userModel.findById('669ac576763192cb88e50385');

        if (!checkUser) {
            return responseHandler({
                status: false,
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Invalid user",
                data: {}
            })
        }
        const shipment:any = await this.shipmentModel.findOne({ userId: id, trackingId }).populate('enterpriseId');
        if (!shipment){
            return responseHandler({
                status: false,
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Invalid tracking ID",
                data: {}
            })
           
         }

        shipment.enterpriseId.logo = await cloudinaryImage(shipment.enterpriseId.logo)
        return responseHandler({
            status: true,
            statusCode: HttpStatus.OK,
            message: 'Shipment fetched',
            data: { shipment }
        })

    }

    async fetchShipments(enterpriseId: string){
        const shipments = await this.shipmentModel.find({ enterpriseId }).populate('senderId');
        if (shipments.length > 0){
            for (let i = 0; i < shipments.length; i++) {
                const shipment: any = shipments[i];
                shipment.userId.avatar = await cloudinaryImage(shipment.userId.avatar)
            }
        }

        return responseHandler({
            status: true,
            statusCode: HttpStatus.OK,
            message: 'Shipments fetched',
            data: { shipments }
        })

    }

    async updateShipmentLocation ( shipmentId: string, data: UpdateShipmentLocation ){
        const shipment = await this.shipmentModel.findByIdAndUpdate(shipmentId, { location: {...data}}, { new: true, runValidators: true }).exec();
        return responseHandler({
            status: true,
            statusCode: HttpStatus.OK,
            message: 'location updated',
            data: { shipment }
        })
    }

    async updateShipmentProgress ( shipmentId: string, data: UpdateShipmentProgress ){
        const now = new Date(Date.now());

        const shipment = await this.shipmentModel.findById(shipmentId)

        shipment.shipmentProgress.push({time: now, ...data})
        shipment.save()
        return responseHandler({
            status: true,
            statusCode: HttpStatus.OK,
            message: 'location updated',
            data: { shipment }
        })
    }

    async updateShipmentStatus ( shipmentId: string, data: UpdateShipmentStatus ){
        const shipment = await this.shipmentModel.findByIdAndUpdate(shipmentId, { status: data.status}, 
            { new: true, runValidators: true }).exec();
        return responseHandler({
            status: true,
            statusCode: HttpStatus.OK,
            message: 'location updated',
            data: { ...shipment.location }
        })
    }




    //fetch shipment for logged-in user
    //fetch shipments by enterprise
    //update shipment location
    //update shipment progress
    //update shipment status


}