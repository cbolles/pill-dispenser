import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Schema()
@ObjectType()
export class Prescription {
  @Field(() => ID)
  _id: mongoose.Types.ObjectId;

  @Prop()
  @Field()
  name: string;
}

export type PrescriptionDocument = Prescription & Document;
export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);
