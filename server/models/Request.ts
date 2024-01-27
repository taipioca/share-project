import { Schema, model, Document } from "mongoose";

const RequestSchema = new Schema({
  requester: {
    requester_id: String,
    requester_name: String,
  },
  sharer: {
    sharer_id: String,
    sharer_name: String,
  },
  title: String,
  item_id: String,
  start_date: String,
  end_date: String,
  sharer_points: Number,
  requester_points: Number,
});

export interface Request extends Document {
  requester: {
    requester_id: string;
    requester_name: string;
  };
  sharer: {
    sharer_id: string;
    sharer_name: string;
  };
  title: string;
  item_id: string;
  _id: string;
  start_date: string;
  end_date: string;
  sharer_points: number;
  requester_points: number;
}

const RequestModel = model<Request>("Request", RequestSchema);
export default RequestModel;
