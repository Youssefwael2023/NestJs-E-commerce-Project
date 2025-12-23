import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: 0 })
  stock: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 0 })
  soldQuantity: number;

  @Prop({ default: 0 })
  totalRevenue: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

