import { Schema, model, Document } from "mongoose";

const RequestSchema = new Schema({
  requester: { type: Schema.Types.ObjectId, ref: "Requester" },
  sharer: { type: Schema.Types.ObjectId, ref: "Sharer" },
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  item: { type: Schema.Types.ObjectId, ref: "Item" },
});

const Request = mongoose.model("Request", RequestSchema);
export default Request;
