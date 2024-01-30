import { Schema, model, Document } from "mongoose";

const UserSchema = new Schema({
  name: String,
  googleid: String,
  points: Number,
  rating: Number,
  numreviews: Number,
});

export interface User extends Document {
  name: string;
  googleid: string;
  numreviews: number;
  points: number;
  rating: number;
  _id: string;
}

const UserModel = model<User>("User", UserSchema);

export default UserModel;
