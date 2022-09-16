import mongoose from "mongoose";
const { Schema } = mongoose;

const scoresSchema = new Schema({
  _id: Schema.Types.ObjectId,
  username: { type: String, required: true },
  time: { type: Number, default: 0, required: false },
});

export default mongoose.model("Score", scoresSchema);
