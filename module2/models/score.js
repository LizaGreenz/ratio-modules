const mongoose = require("mongoose");

const scoresSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true },
  time: { type: Number, default: 0, required: false },
});

module.exports = mongoose.model("Score", scoresSchema);
