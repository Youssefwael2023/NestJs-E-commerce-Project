import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Product", required: true })
  product!: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  user!: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating!: number;

  @Prop({ required: true, trim: true, minlength: 10, maxlength: 1000 })
  title!: string;

  @Prop({ required: true, trim: true, minlength: 20, maxlength: 2000 })
  comment!: string;

  @Prop({ default: 0 })
  helpfulCount!: number;

  @Prop({ default: 0 })
  unhelpfulCount!: number;

  @Prop({ default: true })
  isApproved!: boolean;

  @Prop({ type: [String], default: [] })
  helpfulBy!: string[];

  @Prop({ type: [String], default: [] })
  unhelpfulBy!: string[];

  @Prop({ type: Date, default: null })
  approvedAt?: Date;

  @Prop({ type: Date, default: null })
  rejectedAt?: Date;

  @Prop({ type: String, default: null })
  rejectionReason?: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Create indexes for better query performance
ReviewSchema.index({ product: 1, isApproved: 1 });
ReviewSchema.index({ user: 1 });
ReviewSchema.index({ product: 1, user: 1 }, { unique: true }); // One review per user per product
ReviewSchema.index({ createdAt: -1 });
ReviewSchema.index({ rating: 1 });
