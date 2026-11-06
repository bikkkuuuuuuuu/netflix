const SavedModel = require("./saved.model");

class SavedService {
  saveMovie = async (data) => {
    try {
      const saveObj = new SavedModel(data);
      return await saveObj.save();
    } catch (exception) {
      console.log("saveMovie exception : ", exception);
      throw exception;
    }
  };

  getSingleByFilter = async (filter) => {
    try {
      const saved = await SavedModel.findOne(filter).populate("movie", [
        "_id",
        "title",
        "slug",
        "description",
      ]);
      return saved;
    } catch (exception) {
      console.log("getSingleByFilter exception : ", exception);
      throw exception;
    }
  };
  deleteSavedItem = async (id) => {
    try {
      const response = await SavedModel.findByIdAndDelete(id);
      if (!response) {
        throw {
          code: 400,
          message: "WishList Item does not exist anymore",
          status: "WISHLIST_DOES_NOT_EXIST",
        };
      }
      return response;
    } catch (exception) {
      console.log("deletesavedItem exception", exception);
      throw exception;
    }
  };
  getAllSavedItemsByFilter = async (filter) => {
    try {
      const response = await SavedModel.find(filter).populate({
        path: "movie",
      });

      return response;
    } catch (exception) {
      console.log("Saved getAllSavedByFilter", exception);
      throw exception;
    }
  };
}
const savedSvc = new SavedService();
module.exports = savedSvc;
