import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ collection: 'users', timestamps: true, versionKey: false })
export class Users {
  @Prop({
    type: String,
    unique: true,
    required: true,
    default: () => uuidv4(),
  })
  userId?: string;

  @Prop({
    type: String,
    unique: true,
    required: true,
    index: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    default: null,
  })
  accessToken?: string;
}
export const UsersSchema = SchemaFactory.createForClass(Users);
