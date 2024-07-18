import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.schema';

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true })
export class Otp {
  @Prop({ default: () => uuidv4() })
  id: string;

  @Prop()
  email: string;

  @Prop()
  code: string;

  @Prop()
  expiresAt: Date;

}

export const OtpSchema = SchemaFactory.createForClass(Otp);


