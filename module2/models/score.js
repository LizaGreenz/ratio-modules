const mongoose = require("mongoose");

const scoresSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true },
  time: { type: Number, required: true },
});

module.exports = mongoose.model("Score", scoresSchema);
