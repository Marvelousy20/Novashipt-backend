import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shipment, ShipmentSchema } from './schemas/shipment.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { ShipmentController } from './controller/shipment.controller';
import { ShipmentService } from './shipment.service';
import { Enterprise, EnterpriseSchema } from 'src/users/schemas/enterprise.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shipment.name, schema: ShipmentSchema }, { name: User.name, schema: UserSchema }, { name: Enterprise.name, schema: EnterpriseSchema }])
  ],
  controllers: [ShipmentController],
  providers: [ShipmentService],
  exports:[]
})
export class ShipmentModule {}