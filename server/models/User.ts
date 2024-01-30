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
  _id: string;
  rating: number;
  numreviews: number;
  points: number;
}

const UserModel = model<User>("User", UserSchema);

export default UserModel;
