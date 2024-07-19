import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export enum ShipmentProgress {
  packing = 'packing',
  picked_up = 'picked-up',
  in_transit = 'in-transit'
};

export enum ShipmentStatus {
  shipped = "shipped",
  delivered = "delivered",
  delayed = "delayed"
};

export type ShipmentDocument = Shipment & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Shipment {
    @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
    _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  trackingId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Enterprise', required: true })
  enterpriseId: MongooseSchema.Types.ObjectId;

  @Prop({ type: { longitude: { type: String }, latitude: { type: String }}})
  location: { longitude: string, latitude: string };

  @Prop({ required: true })
  weight: string;

  @Prop({ default: 'NovaShip' })
  service: string;

  @Prop({ default: 'package' })
  category: string;

  @Prop({ enum: ShipmentStatus, default: ShipmentStatus.shipped })
  status: string;

  @Prop([{
    type: {
        status: { type: String, enum: ShipmentProgress, default: ShipmentProgress.packing },
        location: { type: String },
        time: { type: Date, default: () => new Date() }
      }
  }])
  shipmentProgress: [{ status: string, location: string, time: Date}];

  @Prop({ required: true, type: String })
  deliveryDate: string;

  @Prop({ required: true })
  deliveryTimeRange: string;

}

export const ShipmentSchema = SchemaFactory.createForClass(Shipment);

ShipmentSchema.virtual('id').get(function () {
    return this._id.toString();
  });
  
  // Ensure virtual fields are included when converting to JSON
 ShipmentSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
    }
  });
  
  ShipmentSchema.set('toObject', {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
    }
  });
