import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Enterprise, EnterpriseDocument } from 'src/users/schemas/enterprise.schema';
import { CreateEnterpriseDto } from '../dto/user.dto';
import { cloudinaryImage, responseHandler } from 'src/utils';

@Injectable()
export class EnterpriseService {

  constructor(
     @InjectModel(User.name)
     private userModel: Model<UserDocument>,
     @InjectModel(Enterprise.name)
     private enterpriseModel: Model<EnterpriseDocument>,
    ) {}

    //create enterprise
    async createEnterprise ( data: CreateEnterpriseDto){
        const checkEnterprise = await this.enterpriseModel.findOne({ name: data.name })

        if (checkEnterprise) {
            return responseHandler({
                status: false,
                statusCode: HttpStatus.CONFLICT,
                message: 'Enterprise with this name exists already',
                data: {}
            })
        }

        const newEnterprise = new this.enterpriseModel({...data})

        await newEnterprise.save();

        const { logo, name, id } = newEnterprise

        return responseHandler({
            status: true,
            statusCode: HttpStatus.CREATED,
            message: 'Enterprise created successfully',
            data: { id, name, logo }
        })
    }

    async fetchEnterprises (){
        const enterprises = await this.enterpriseModel.find().populate('shipments')

        if (enterprises.length > 0){
            for (let i = 0; i < enterprises.length; i++) {
                const enterprise = enterprises[i];
                delete enterprise._id
                enterprise.logo = await cloudinaryImage(enterprise.logo)
            }
        }

        return responseHandler({
            status: true,
            statusCode: HttpStatus.OK,
            message: 'Enterprises fetched successfully',
            data: { enterprises }
        })

    }

    //fetch users
    async fetchUsers (){
        const users = await this.userModel.find()
        if (users.length > 0){
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                delete user._id
                user.avatar = await cloudinaryImage(user.avatar)
            }
        }
        return responseHandler({
            status: true,
            statusCode: HttpStatus.OK,
            message: 'Users fetched successfully',
            data: { users }
        })

    }

    async deleteUsers (){
        await this.userModel.deleteMany()
        return responseHandler({
            status: true,
            statusCode: HttpStatus.OK,
            message: 'Users purged',
            data: {}
        })

    }

    async deleteEnterprise (){
        await this.enterpriseModel.deleteMany()
        return responseHandler({
            status: true,
            statusCode: HttpStatus.OK,
            message: 'Enterprises purged',
            data: {}
        })

    }


}