import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: MongooseSchema.Types.ObjectId;

  @Prop({
    type: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: { type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true },
      },
    ],
    required: true,
  })
  orderItems: Array<{
    name: string;
    qty: number;
    image: string;
    price: number;
    product: MongooseSchema.Types.ObjectId;
  }>;

  @Prop({
    type: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    required: true,
  })
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ required: true })
  itemsPrice: number;

  @Prop({ required: true })
  shippingPrice: number;

  @Prop({ required: true })
  taxPrice: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop()
  paidAt: Date;

  @Prop({ default: false })
  isDelivered: boolean;

  @Prop({ default: false })
  isShipped: boolean;

  @Prop()
  deliveredAt: Date;

  @Prop({ enum: ['Pending', 'Shipped', 'Delivered'], default: 'Pending' })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

