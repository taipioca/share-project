import { Schema, model, Document } from "mongoose";

const ProductSchema = new Schema({
  id: String,
  title: String,
  description: String,
  points: Number,
  minShareDays: Number,
  maxShareDays: Number,
  pickupLocation: String,
  returnLocation: String,
  pickupNotes: String,
  returnNotes: String,
  image: String,
  sharer: {
    sharer_id: String,
    sharer_name: String,
  },
  status: {
    type: String,
    enum: ["available", "pending", "unavailable"],
    default: "available",
  },
});

export interface Product extends Document {
  id?: string;
  title?: string;
  description?: string;
  points?: number;
  minShareDays?: number;
  maxShareDays?: number;
  pickupLocation?: string;
  returnLocation?: string;
  pickupNotes?: string;
  a;
  returnNotes?: string;
  image?: string;
  sharer?: {
    sharer_id?: string;
    sharer_name?: string;
  };
  status?: "available" | "pending" | "unavailable";

  _id?: string;
}

const ProductModel = model<Product>("Product", ProductSchema);

export default ProductModel;
