import {
  Controller,
  Post,
  Body,
  Inject,
  HttpException,
  HttpStatus,
  HttpCode,
  UseInterceptors,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { timeout } from "rxjs/operators";
import { TimeoutInterceptor } from "../common/interceptors/timeout.interceptor";

@Controller("api/chatbot")
@UseInterceptors(new TimeoutInterceptor(30000)) // 30 second timeout for chatbot (AI API calls)
export class ChatbotController {
  constructor(
    @Inject("CHATBOT_SERVICE") private readonly chatbotClient: ClientProxy
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async processMessage(@Body() body: any) {
    try {
      const result = await firstValueFrom(
        this.chatbotClient.send({ cmd: "process-message" }, body).pipe(timeout(30000))
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
        error.message || "Failed to process message",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
