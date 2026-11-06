const mongoose = require("mongoose");
const WatchHistoryModel = require("./watchHistory.model");

class WatchHistoryService {
  async updateProgress({ userId, movieId, progress, duration }) {
    const safeProgress = Math.max(0, Number(progress) || 0);
    const safeDuration = Math.max(0, Number(duration) || 0);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw { code: 400, message: "Invalid user ID" };
    }

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      throw { code: 400, message: "Invalid movie ID" };
    }

    if (safeDuration <= 0) {
      throw { code: 400, message: "Invalid video duration" };
    }

    const finalProgress = Math.min(safeProgress, safeDuration);
    const completed = finalProgress / safeDuration >= 0.9;

    return await WatchHistoryModel.findOneAndUpdate(
      {
        user: userId,
        movie: movieId,
      },
      {
        $set: {
          progress: finalProgress,
          duration: safeDuration,
          completed,
          lastWatchedAt: new Date(),
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  async getUserHistory(userId, limit = 30) {
    return await WatchHistoryModel.find({ user: userId })
      .sort({ lastWatchedAt: -1 })
      .limit(limit)
      .populate("movie")
      .lean();
  }

  async getContinueWatching(userId, limit = 10) {
    return await WatchHistoryModel.find({
      user: userId,
      completed: false,
      progress: { $gt: 0 },
    })
      .sort({ lastWatchedAt: -1 })
      .limit(limit)
      .populate("movie")
      .lean();
  }
}

const watchHistorySvc = new WatchHistoryService();
module.exports = watchHistorySvc;
