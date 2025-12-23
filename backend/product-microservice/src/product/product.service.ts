import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async getAllProducts() {
    return await this.productModel.find();
  }

  async getProductById(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async createProduct(data: {
    name: string;
    image: string;
    price: number;
    stock: number;
    description: string;
    category: string;
    discount?: number;
  }) {
    const newProduct = new this.productModel(data);
    return await newProduct.save();
  }

  async updateProduct(id: string, data: any) {
    const product = await this.productModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async deleteProduct(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return { message: 'Product deleted successfully' };
  }

  async sellProduct(data: { productId: string; quantity: number }) {
    const product = await this.productModel.findById(data.productId);
    if (!product) {
      throw new Error('Product not found');
    }
    if (product.stock < data.quantity) {
      throw new Error('Not enough stock');
    }

    // Handle discount - ensure it's a valid number, default to 0 if undefined/null
    const discount = product.discount && typeof product.discount === 'number' ? product.discount : 0;
    const priceAfterDiscount = product.price * (1 - discount / 100);
    
    // Initialize soldQuantity and totalRevenue if they don't exist
    if (!product.soldQuantity) product.soldQuantity = 0;
    if (!product.totalRevenue) product.totalRevenue = 0;
    
    product.soldQuantity += data.quantity;
    product.totalRevenue += priceAfterDiscount * data.quantity;
    product.stock -= data.quantity;

    await product.save();
    return {
      message: 'Product sold successfully',
      product,
    };
  }
}

