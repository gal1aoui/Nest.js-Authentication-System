import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole, UserStatus } from 'src/types/user';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.DEVELOPER })
  role: UserRole;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop()
  avatar?: string;

  @Prop({ default: null })
  lastLoginAt: Date;

  @Prop({ type: Object, default: {} })
  preferences: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    emailNotifications?: boolean;
  };

  @Prop([String])
  projectIds: string[];

  createdAt: Date;
  updatedAt: Date;
}

export const UsersSchema = SchemaFactory.createForClass(User);
