import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Inject,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { timeout } from "rxjs/operators";
import { TimeoutInterceptor } from "../common/interceptors/timeout.interceptor";

@Controller("api/categories")
@UseInterceptors(new TimeoutInterceptor(15000)) // 15 second timeout for category operations
export class CategoryController {
  constructor(
    @Inject("PRODUCT_SERVICE") private readonly productClient: ClientProxy
  ) {}

  @Get()
  async getAllCategories() {
    try {
      const result = await firstValueFrom(
        this.productClient.send({ cmd: "get-all-categories" }, {}).pipe(timeout(15000))
      );
      if (result && result.error) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to fetch categories",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  async createCategory(
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File
  ) {
    try {
      let categoryData = { ...body };
      if (file) {
        // Convert file to base64
        const fileData = file.buffer.toString("base64");
        const mimeType = file.mimetype;
        categoryData.image = `data:${mimeType};base64,${fileData}`;
      }

      const result = await firstValueFrom(
        this.productClient.send({ cmd: "create-category" }, categoryData).pipe(timeout(15000))
      );
      if (result && result.error) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to create category",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(":id")
  @UseInterceptors(FileInterceptor("image"))
  async updateCategory(
    @Param("id") id: string,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File
  ) {
    try {
      let updateData = { ...body };
      if (file) {
        // Convert file to base64 only if file is provided
        const fileData = file.buffer.toString("base64");
        const mimeType = file.mimetype;
        updateData.image = `data:${mimeType};base64,${fileData}`;
      }

      const result = await firstValueFrom(
        this.productClient.send({ cmd: "update-category" }, { id, updateData }).pipe(timeout(15000))
      );
      if (result && result.error) {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to update category",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(":id")
  async deleteCategory(@Param("id") id: string) {
    try {
      const result = await firstValueFrom(
        this.productClient.send({ cmd: "delete-category" }, id).pipe(timeout(15000))
      );
      if (result && result.error) {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to delete category",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
