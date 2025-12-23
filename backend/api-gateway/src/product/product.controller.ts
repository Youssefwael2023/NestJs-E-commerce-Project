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

@Controller("api/products")
@UseInterceptors(new TimeoutInterceptor(15000)) // 15 second timeout for product operations
export class ProductController {
  constructor(
    @Inject("PRODUCT_SERVICE") private readonly productClient: ClientProxy
  ) {}

  @Get()
  async getAllProducts() {
    try {
      const result = await firstValueFrom(
        this.productClient.send({ cmd: "get-all-products" }, {}).pipe(timeout(15000))
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
        error.message || "Failed to fetch products",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id")
  async getProduct(@Param("id") id: string) {
    try {
      const result = await firstValueFrom(
        this.productClient.send({ cmd: "get-product" }, id).pipe(timeout(15000))
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
        error.message || "Failed to fetch product",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  async createProduct(
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File
  ) {
    try {
      // If file is uploaded, convert it to a data URL or save it
      let productData = { ...body };
      if (file) {
        // Convert file to base64 or store file path
        const fileData = file.buffer.toString("base64");
        const mimeType = file.mimetype;
        productData.image = `data:${mimeType};base64,${fileData}`;
      }

      const result = await firstValueFrom(
        this.productClient.send({ cmd: "create-product" }, productData).pipe(timeout(15000))
      );
      if (result && result.error) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }
      return { message: "Product added successfully", product: result };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to create product",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(":id")
  @UseInterceptors(FileInterceptor("image"))
  async updateProduct(
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
        this.productClient.send({ cmd: "update-product" }, { id, updateData }).pipe(timeout(15000))
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
        error.message || "Failed to update product",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(":id")
  async deleteProduct(@Param("id") id: string) {
    try {
      const result = await firstValueFrom(
        this.productClient.send({ cmd: "delete-product" }, id).pipe(timeout(15000))
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
        error.message || "Failed to delete product",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put("sell/:id")
  async sellProduct(@Param("id") id: string, @Body() body: any) {
    try {
      const result = await firstValueFrom(
        this.productClient.send(
          { cmd: "sell-product" },
          { productId: id, quantity: body.quantity }
        ).pipe(timeout(15000))
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
        error.message || "Failed to sell product",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
