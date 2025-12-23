import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChatbotService } from './chatbot.service';

@Controller()
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @MessagePattern({ cmd: 'process-message' })
  async processMessage(@Payload() data: any) {
    try {
      return await this.chatbotService.processMessage(data);
    } catch (error) {
      return { error: error.message };
    }
  }
}

