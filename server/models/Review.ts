import { Schema, model, Document } from "mongoose";

const ReviewSchema = new Schema({
  reviewer: {
    reviewer_id: String,
    reviewer_name: String,
  },
  sharer: {
    sharer_id: String,
    sharer_name: String,
  },
  rating: Number,
  comment: String,
  timestamp: { type: Date, default: Date.now },
});

export interface Review extends Document {
  reviewer: {
    reviewer_id: String;
    reviewer_name: String;
  };
  sharer: {
    sharer_id: String;
    sharer_name: String;
  };
  rating: Number;
  comment: String;
  timestamp: Date;
  _id: String;
}

const ReviewModel = model<Review>("Review", ReviewSchema);

export default ReviewModel;