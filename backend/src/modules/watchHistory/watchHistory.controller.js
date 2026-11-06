const watchHistorySvc = require("./watchHistory.service");

class WatchHistoryController {
  updateProgress = async (req, res, next) => {
    try {
      const { movieId, progress, duration } = req.body;

      const history = await watchHistorySvc.updateProgress({
        userId: req.authUser._id,
        movieId,
        progress,
        duration,
      });

      res.json({
        detail: history,
        message: "Watch progress updated successfully",
        status: "WATCH_HISTORY_UPDATE_SUCCESS",
        options: null,
      });
    } catch (exception) {
      console.log("Watch history update exception:", exception);
      next(exception);
    }
  };

  continueWatching = async (req, res, next) => {
    try {
      const data = await watchHistorySvc.getContinueWatching(
        req.authUser._id,
        Math.min(Number(req.query.limit) || 10, 30),
      );

      res.json({
        detail: data,
        message: "Continue watching fetched successfully",
        status: "CONTINUE_WATCHING_SUCCESS",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };
}

const watchHistoryCtrl = new WatchHistoryController();
module.exports = watchHistoryCtrl;
