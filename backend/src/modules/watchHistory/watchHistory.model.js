const mongoose = require("mongoose");
const { schemaOpts } = require("../../common/schema");
const WatchHistoryScehma = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
      index: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    lastWatchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  schemaOpts,
);

WatchHistoryScehma.index(
  {
    user: 1,
    movie: 1,
  },
  {
    unique: true,
  },
);

const WatchHistoryModel = mongoose.model("WatchHistory", WatchHistoryScehma);
module.exports = WatchHistoryModel;
