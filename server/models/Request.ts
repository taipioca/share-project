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
  status: {
    type: String,
    enum: ["open", "pending", "close"],
    default: "open",
  },
});

export interface RequestDoc extends Document {
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
  start_date: string;
  end_date: string;
  sharer_points: number;
  requester_points: number;
  status?: "open" | "pending" | "close";
  _id: string;
}

const RequestModel = model<RequestDoc>("Request", RequestSchema);
export default RequestModel;
