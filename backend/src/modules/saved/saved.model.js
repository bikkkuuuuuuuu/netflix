const mongoose = require("mongoose");

const SavedSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
const SavedModel = mongoose.model("Saved", SavedSchema);
module.exports = SavedModel;
