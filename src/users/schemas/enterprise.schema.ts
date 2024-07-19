import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type EnterpriseDocument = Enterprise & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Enterprise {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 'test logo' })
  logo: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Shipment' }])
  shipments: [MongooseSchema.Types.ObjectId];
}

export const EnterpriseSchema = SchemaFactory.createForClass(Enterprise);

// Add a virtual field for id
EnterpriseSchema.virtual('id').get(function () {
  return this._id.toString();
});

// Ensure virtual fields are included when converting to JSON
EnterpriseSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

EnterpriseSchema.set('toObject', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});
