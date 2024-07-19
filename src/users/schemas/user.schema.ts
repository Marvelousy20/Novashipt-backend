import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcrypt';

export enum UserType {
  USER = 'user',
  ADMIN = 'admin',
  ENTERPRISE = 'ENTERPRISE'
};

export enum AccountStatus {
  active = "active",
  suspended = "suspended",
  pending = "pending"
};

export interface UserInterface {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  avatar?: string;
  gender?: string;
  role: string;
  accountRecoveryInitiated?: boolean;
  emailVerified?: boolean;
  locationData?: object;
  accountStatus: string;
}

export type UserDocument = User & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  address: string;

  @Prop()
  gender: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ enum: AccountStatus, default: AccountStatus.pending })
  status: string;

  @Prop({ enum: UserType, default: UserType.USER })
  role: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  emailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.set('toJSON', {
  transform: function (_doc, ret, _options) {
    delete ret.password;
    delete ret.__v;
    return ret;
  }

});

UserSchema.virtual('id').get(function () {
  return this._id.toString();
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

UserSchema.set('toObject', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

