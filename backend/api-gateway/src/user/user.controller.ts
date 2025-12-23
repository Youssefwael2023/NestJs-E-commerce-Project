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
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { timeout } from "rxjs/operators";
import { TimeoutInterceptor } from "../common/interceptors/timeout.interceptor";

@Controller("api/users")
@UseInterceptors(new TimeoutInterceptor(10000)) // 10 second timeout for auth operations
export class UserController {
  constructor(
    @Inject("AUTH_SERVICE") private readonly authClient: ClientProxy
  ) {}

  @Post("register")
  async register(@Body() body: any) {
    try {
      const result = await firstValueFrom(
        this.authClient.send({ cmd: "signup" }, body).pipe(timeout(10000))
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
        error.message || "Registration failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("login")
  async login(@Body() body: any) {
    try {
      const result = await firstValueFrom(
        this.authClient.send({ cmd: "login" }, body).pipe(timeout(10000))
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
        error.message || "Login failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  async getAllUsers() {
    try {
      const result = await firstValueFrom(
        this.authClient.send({ cmd: "get-all-users" }, {}).pipe(timeout(10000))
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
        error.message || "Failed to fetch users",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("profile/:id")
  async getProfile(@Param("id") id: string) {
    try {
      const result = await firstValueFrom(
        this.authClient.send({ cmd: "get-user" }, id).pipe(timeout(10000))
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
        error.message || "Failed to fetch profile",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put("profile/:id")
  async updateProfile(@Param("id") id: string, @Body() body: any) {
    try {
      const result = await firstValueFrom(
        this.authClient.send({ cmd: "update-user" }, { id, updateData: body }).pipe(timeout(10000))
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
        error.message || "Failed to update profile",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(":id")
  async deleteUser(@Param("id") id: string) {
    try {
      const result = await firstValueFrom(
        this.authClient.send({ cmd: "delete-user" }, id).pipe(timeout(10000))
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
        error.message || "Failed to delete user",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
