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

// import mongoose from "mongoose";

// //define a product schema for the database
// const ProductSchema = new mongoose.Schema({
//   item_id: String,
//   item_title: String,
//   item_description: String,
//   price: Number,
//   min_share_day: Number,
//   max_share_day: Number,
//   pickup_location: String,
//   pickup_note: String,
//   return_location: String,
//   return_note: String,
//   product_image: URL,
//   sharer: {
//     sharer_id: String,
//     name: String,
//   },
// });

// // compile model from schema
// module.exports = mongoose.model("product", ProductSchema);

// export default UserModel;
