const movieSvc = require("../movies/movies.service");
const savedSvc = require("./saved.service");

class SavedController {
  save = async (req, res, next) => {
    try {
      let data = {
        movie: req.body.movie,
        user: req.authUser._id,
      };
      if (!data.movie) {
        return res.status(400).json({ message: "Movie is required" });
      }
      const movieDetail = await movieSvc.getSingleByFilter({
        _id: data.movie,
        "processing.status": "ready",
      });
      if (!movieDetail) {
        return res.status(404).json({ message: "Movie not found " });
      }
      const existingSavedItem = await savedSvc.getSingleByFilter({
        movie: movieDetail._id,
        user: req.authUser._id,
      });
      if (existingSavedItem) {
        return res
          .status(409)
          .json({ message: "Movie already in saved", status: "ALREADY_SAVED" });
      }
      const savedItem = await savedSvc.saveMovie(data);
      res.json({
        detail: savedItem,
        message: "Movie saved successfully",
        status: "SAVE_SUCESS",
        options: null,
      });
    } catch (exception) {
      console.log("save exception : ", exception);
      next(exception);
    }
  };
  delete = async (req, res, next) => {
    try {
      const savedItemId = req.params.id;
      const user = req.authUser;
      let filter = { _id: savedItemId };
      if (user.role === "user") {
        filter = { ...filter, user: user._id };
      }
      const savedItem = await savedSvc.getSingleByFilter(filter);

      if (!savedItem) {
        return res.status(400).json({
          data: {},
          message: "Item does not exist",
          status: "ITEM_NOT_FOUND",
          options: null,
        });
      }
      console.log("saved", savedItem.user.toString());
      console.log("loggedInUser", user._id.toString());
      if (savedItem.user.toString() !== user._id.toString()) {
        return res.status(400).json({
          data: {},
          message: "Not your saved Item",
          status: "ITEM_NOT_FOUND",
          options: null,
        });
      }
      const del = await savedSvc.deleteSavedItem(savedItem._id);
      res.json({
        detail: del,
        message: "Item deleted successfully",
        status: "ITEM_REMOVED",
        options: null,
      });
    } catch (exception) {
      console.log("delete exception : ", exception);
      next(exception);
    }
  };
  mySaved = async (req, res, next) => {
    try {
      let filter = {};
      let loggedInUser = req.authUser;
      if (loggedInUser.role === "user") {
        filter = {
          ...filter,
          user: loggedInUser._id,
        };
      }

      const data = await savedSvc.getAllSavedItemsByFilter(filter);

      //todo:fix this later
      // if (data.user._id !== loggedInUser._id.toString()) {
      //     res.json({
      //         detail: {},
      //         message: "Not your saved items",
      //         status: "ERROR",
      //         options: null
      //     })

      // }
      res.json({
        detail: data,
        message: "Saved items fetched",
        status: "GET_SAVED_SUCCESS",
        options: null,
      });
    } catch (exception) {
      console.log("mySaved exception : ", exception);
      next(exception);
    }
  };
}
const savedCtrl = new SavedController();
module.exports = savedCtrl;
