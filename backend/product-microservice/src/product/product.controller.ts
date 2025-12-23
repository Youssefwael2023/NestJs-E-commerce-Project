import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern({ cmd: 'get-all-products' })
  async getAllProducts() {
    try {
      return await this.productService.getAllProducts();
    } catch (error) {
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: 'get-product' })
  async getProduct(@Payload() id: string) {
    try {
      return await this.productService.getProductById(id);
    } catch (error) {
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: 'create-product' })
  async createProduct(@Payload() data: any) {
    try {
      return await this.productService.createProduct(data);
    } catch (error) {
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: 'update-product' })
  async updateProduct(@Payload() data: { id: string; updateData: any }) {
    try {
      return await this.productService.updateProduct(data.id, data.updateData);
    } catch (error) {
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: 'delete-product' })
  async deleteProduct(@Payload() id: string) {
    try {
      return await this.productService.deleteProduct(id);
    } catch (error) {
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: 'sell-product' })
  async sellProduct(@Payload() data: any) {
    try {
      return await this.productService.sellProduct(data);
    } catch (error) {
      return { error: error.message };
    }
  }
}

