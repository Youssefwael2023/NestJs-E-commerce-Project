import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoryService } from './category.service';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern({ cmd: 'get-all-categories' })
  async getAllCategories() {
    try {
      return await this.categoryService.getAllCategories();
    } catch (error) {
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: 'create-category' })
  async createCategory(@Payload() data: any) {
    try {
      return await this.categoryService.createCategory(data);
    } catch (error) {
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: 'update-category' })
  async updateCategory(@Payload() data: { id: string; updateData: any }) {
    try {
      return await this.categoryService.updateCategory(data.id, data.updateData);
    } catch (error) {
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: 'delete-category' })
  async deleteCategory(@Payload() id: string) {
    try {
      return await this.categoryService.deleteCategory(id);
    } catch (error) {
      return { error: error.message };
    }
  }
}

