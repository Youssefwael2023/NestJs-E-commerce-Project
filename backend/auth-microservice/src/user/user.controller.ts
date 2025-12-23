import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UserService } from "./user.service";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: "signup" })
  async signup(@Payload() data: any) {
    try {
      console.log("📨 [UserController] Signup request received:", {
        email: data.email,
        name: data.name,
      });
      const result = await this.userService.register(data);
      console.log("✅ [UserController] Signup successful, returning result");
      return result;
    } catch (error) {
      console.error("❌ [UserController] Signup error:", error.message);
      console.error("❌ [UserController] Error stack:", error.stack);
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: "login" })
  async login(@Payload() data: any) {
    try {
      return await this.userService.login(data);
    } catch (error) {
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: "get-all-users" })
  async getAllUsers() {
    try {
      return await this.userService.getAllUsers();
    } catch (error) {
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: "get-user" })
  async getUser(@Payload() id: string) {
    try {
      return await this.userService.getUserById(id);
    } catch (error) {
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: "update-user" })
  async updateUser(@Payload() data: { id: string; updateData: any }) {
    try {
      return await this.userService.updateUser(data.id, data.updateData);
    } catch (error) {
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: "delete-user" })
  async deleteUser(@Payload() id: string) {
    try {
      return await this.userService.deleteUser(id);
    } catch (error) {
      return { error: error.message };
    }
  }

  @MessagePattern({ cmd: "validate-token" })
  async validateToken(@Payload() token: string) {
    try {
      return await this.userService.validateToken(token);
    } catch (error) {
      return { error: error.message };
    }
  }
}
