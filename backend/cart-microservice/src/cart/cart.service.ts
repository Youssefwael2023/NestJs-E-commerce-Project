import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as mongoose from "mongoose";
import { Cart, CartDocument } from "../schemas/cart.schema";

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  async getCart(userId: string) {
    try {
      // Convert userId string to ObjectId for proper querying
      const userObjectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;
      
      const cart = await this.cartModel.findOne({ user: userObjectId }).populate({
        path: "items.product",
        select: "_id name price discount image stock category description",
      });

      if (!cart) {
        return { user: userId, items: [] };
      }

      // Filter out items with null products (deleted products) but don't save
      if (cart.items && Array.isArray(cart.items)) {
        const hasNullItems = cart.items.some((item) => item.product === null);
        if (hasNullItems) {
          // Only save if we actually found null items
          cart.items = cart.items.filter((item) => item.product !== null);
          await cart.save();
        }
      }

      return cart;
    } catch (error) {
      console.error("Error fetching cart:", error);
      // If populate fails, return empty cart to avoid null data
      return { user: userId, items: [] };
    }
  }

  async addOrUpdateCartItem(data: {
    userId: string;
    productId: string;
    quantity: number;
  }) {
    console.log("🛒 Cart Service: addOrUpdateCartItem called with:", data);

    // Validate inputs
    if (!data.userId || !data.productId || !data.quantity) {
      console.error("🛒 Cart Service: Invalid data - missing required fields");
      throw new Error("Invalid cart item data");
    }

    // Convert userId string to ObjectId for proper querying
    const userObjectId = mongoose.Types.ObjectId.isValid(data.userId) ? new mongoose.Types.ObjectId(data.userId) : data.userId;
    const productObjectId = mongoose.Types.ObjectId.isValid(data.productId) ? new mongoose.Types.ObjectId(data.productId) : data.productId;

    let cart = await this.cartModel.findOne({ user: userObjectId });
    console.log("🛒 Cart Service: Found existing cart:", !!cart);

    if (!cart) {
      console.log("🛒 Cart Service: Creating new cart for user:", data.userId);
      cart = new this.cartModel({ user: userObjectId, items: [] });
    }

    // Convert productId to ObjectId for comparison
    const productIdStr = productObjectId.toString();

    const itemIndex = cart.items.findIndex((item) => {
      const itemProductId = item.product.toString();
      return itemProductId === productIdStr;
    });

    if (itemIndex > -1) {
      // Update existing item quantity
      console.log(
        "🛒 Cart Service: Updating existing item quantity from",
        cart.items[itemIndex].quantity,
        "to",
        data.quantity
      );
      cart.items[itemIndex].quantity = data.quantity;
    } else {
      // Add new item
      console.log("🛒 Cart Service: Adding new product to cart");
      cart.items.push({
        product: productObjectId as any,
        quantity: data.quantity,
      });
    }

    console.log(
      "🛒 Cart Service: Saving cart with",
      cart.items.length,
      "items"
    );
    const savedCart = await cart.save();
    console.log("🛒 Cart Service: Cart saved successfully");
    
    // Populate product details before returning
    const populatedCart = await this.cartModel
      .findById(savedCart._id)
      .populate({
        path: "items.product",
        select: "_id name price discount image stock category description",
      });
    
    console.log("🛒 Cart Service: Cart populated with product details");
    return populatedCart || savedCart;
  }

  async removeCartItem(data: { userId: string; productId: string }) {
    // Convert userId string to ObjectId for proper querying
    const userObjectId = mongoose.Types.ObjectId.isValid(data.userId) ? new mongoose.Types.ObjectId(data.userId) : data.userId;
    const productObjectId = mongoose.Types.ObjectId.isValid(data.productId) ? new mongoose.Types.ObjectId(data.productId) : data.productId;
    
    const cart = await this.cartModel.findOne({ user: userObjectId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productObjectId.toString()
    );
    return await cart.save();
  }

  async clearCart(userId: string) {
    // Convert userId string to ObjectId for proper querying
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;
    
    const cart = await this.cartModel.findOne({ user: userObjectId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.items = [];
    return await cart.save();
  }
}
