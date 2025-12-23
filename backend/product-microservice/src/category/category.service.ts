import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async getAllCategories() {
    return await this.categoryModel.find();
  }

  async createCategory(data: { name: string; image: string }) {
    if (!data.name || !data.image) {
      throw new Error('Category name and image are required');
    }
    const newCategory = new this.categoryModel(data);
    return await newCategory.save();
  }

  async updateCategory(id: string, data: { name?: string; image?: string }) {
    if (!id || !data.name) {
      throw new Error('Category ID and name are required');
    }
    const updateData: any = { name: data.name };
    if (data.image) updateData.image = data.image;

    const updatedCategory = await this.categoryModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
    if (!updatedCategory) {
      throw new Error('Category not found');
    }
    return updatedCategory;
  }

  async deleteCategory(id: string) {
    if (!id) {
      throw new Error('Category ID is required');
    }
    const category = await this.categoryModel.findByIdAndDelete(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return { message: 'Category deleted successfully' };
  }
}

