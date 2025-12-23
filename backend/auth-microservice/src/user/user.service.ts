import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { User, UserDocument } from "../schemas/user.schema";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) {
    try {
      console.log("📝 [UserService] Register called with:", {
        name: data.name,
        email: data.email,
        role: data.role,
      });

      // Check MongoDB connection first
      const dbConnection = this.userModel.db as any;
      const connectionState = dbConnection?.readyState;
      console.log(
        "📝 [UserService] MongoDB connection state:",
        connectionState
      );
      console.log(
        "📝 [UserService] Connection state meaning:",
        connectionState === 0
          ? "Disconnected"
          : connectionState === 1
          ? "Connected ✅"
          : connectionState === 2
          ? "Connecting..."
          : connectionState === 3
          ? "Disconnecting"
          : "Unknown"
      );

      if (connectionState !== 1) {
        const errorMsg = `MongoDB not connected! State: ${connectionState}. Please wait for connection to establish.`;
        console.error("❌ [UserService]", errorMsg);
        throw new Error(errorMsg);
      }

      if (dbConnection) {
        console.log(
          "📝 [UserService] Database name:",
          dbConnection.databaseName
        );
        console.log("📝 [UserService] Host:", dbConnection.host);
      }

      console.log("📝 [UserService] Checking if user exists...");
      const existingUser = await this.userModel.findOne({ email: data.email });
      if (existingUser) {
        console.log("⚠️ [UserService] User already exists");
        throw new Error("Email already exists");
      }

      console.log("📝 [UserService] Hashing password...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      console.log("📝 [UserService] Creating new user model...");
      const newUser = new this.userModel({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || "user",
      });

      console.log("📝 [UserService] Attempting to save user to database...");
      console.log(
        "📝 [UserService] Collection name:",
        this.userModel.collection.name
      );

      const savedUser = await newUser.save();

      console.log("✅ [UserService] User saved successfully!");
      console.log("✅ [UserService] User ID:", savedUser._id);
      console.log("✅ [UserService] Database:", dbConnection?.databaseName);
      console.log(
        "✅ [UserService] Collection:",
        this.userModel.collection.name
      );

      // Verify the document was actually saved
      const verifyUser = await this.userModel.findById(savedUser._id);
      if (verifyUser) {
        console.log("✅ [UserService] Verification: User found in database!");
      } else {
        console.error(
          "❌ [UserService] Verification: User NOT found in database!"
        );
      }

      const userObj = savedUser.toObject();
      delete userObj.password;
      return userObj;
    } catch (error) {
      console.error("❌ [UserService] Register error:", error.message);
      console.error("❌ [UserService] Error name:", error.name);
      console.error("❌ [UserService] Error code:", (error as any).code);
      console.error("❌ [UserService] Error stack:", error.stack);
      throw error;
    }
  }

  async login(data: { email: string; password: string }) {
    const user = await this.userModel.findOne({ email: data.email });
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    return {
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getAllUsers() {
    return await this.userModel.find().select("-password");
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateUser(
    id: string,
    data: { name?: string; email?: string; password?: string }
  ) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(data.password, salt);
    }

    const updatedUser = await user.save();
    const userObj = updatedUser.toObject();
    delete userObj.password;
    return userObj;
  }

  async deleteUser(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new Error("User not found");
    }
    return { message: "User deleted successfully" };
  }

  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as any;
      const user = await this.userModel
        .findById(decoded.id)
        .select("-password");
      return user;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
