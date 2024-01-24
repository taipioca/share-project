import { Schema, model, Document } from "mongoose";

const RequestSchema = new Schema({
  requester_id: String,
  sharer_id: String,
  item_id: String,
});

export interface Request extends Document {
  requester_id: string;
  sharer_id: string;
  item_id: string;
  _id: string;
}

const RequestModel = model<Request>("Request", RequestSchema);
export default RequestModel;
