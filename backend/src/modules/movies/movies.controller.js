const movieSvc = require("./movies.service");

class MovieController {
  create = async (req, res, next) => {
    try {
      const { data, poster, backdrop, logo, video } =
        await movieSvc.transformCreateRequest(req);
      const movie = await movieSvc.createMovie({
        data,
        poster,
        backdrop,
        logo,
        video,
      });

      res.json({
        detail: movie,
        message: "Movie created successfully",
        status: "MOVIE_CREATE_SUCCESS",
        options: null,
      });
    } catch (exception) {
      console.log("Movie create controller exception ", exception);
      next(exception);
    }
  };
  index = async (req, res, next) => {
    try {
      let page = +req.query.page || 1;
      let limit = +req.query.limit || 20;
      let skip = (page - 1) * limit;

      let filter = {};
      if (req.query.search) {
        filter.$or = [
          { title: new RegExp(req.query.search, "i") },
          { status: new RegExp(req.query.search, "i") },
        ];
      }

      let data = await movieSvc.listAllMovie({ skip, limit, filter });
      const totalCount = await movieSvc.countData(filter);

      res.json({
        detail: data,
        message: "Movie list successfully",
        status: "BANNER_LIST_SUCCESS",
        options: {
          currentPage: page,
          limit: limit,
          totalDate: totalCount,
        },
      });
    } catch (exception) {
      console.log("Movie index controller exception ", exception);
      next(exception);
    }
  };
  detail = async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = await movieSvc.getSingleByFilter({
        _id: id,
      });
      res.json({
        detail: data,
        message: "Movie detail successfully",
        status: "BANNER_DETAIL_SUCCESS",
        options: null,
      });
    } catch (exception) {
      console.log("Movie detail controller exception ", exception);
      next(exception);
    }
  };
  update = async (req, res, next) => {
    try {
      const data = await movieSvc.getSingleByFilter({
        _id: req.params.id,
      });
      const transformData = await movieSvc.transformUpdateRequest(req, data);
      const response = await movieSvc.updateByFilter(
        {
          _id: req.params.id,
        },
        transformData,
      );

      res.json({
        detail: response,
        message: "Movie update successfully",
        status: "BANNER_UPDATE_SUCCESS",
        options: null,
      });
    } catch (exception) {
      console.log("Movie update controller exception ", exception);
      next(exception);
    }
  };
  delete = async (req, res, next) => {
    try {
      const data = await movieSvc.getSingleByFilter({
        _id: req.params.id,
      });
      if (!data) {
        throw new Error("Movie Not found");
      }
      const response = await movieSvc.deleteByFilter({
        _id: req.params.id,
      });
      res.json({
        detail: response,
        message: "Movie delete successfully",
        status: "MOVIE_DELETE_SUCCESS",
        options: null,
      });
    } catch (exception) {
      console.log("Movie delete controller exception ", exception);
      next(exception);
    }
  };
  getForHome = async (req, res, next) => {
    try {
      let filter = {
        $and: [
          { status: "active" },
          { startDate: { $lte: new Date() } },
          { endDate: { $gte: new Date() } },
        ],
      };
      const listMovie = await movieSvc.listAllMovie({
        skip: 0,
        limit: 10,
        filter: filter,
      });
      res.json({
        detail: listMovie,
        message: "Movie list successfully",
        status: "BANNER_LIST_SUCCESS",
        options: null,
      });
    } catch (exception) {
      console.log("Movie getForHome controller exception ", exception);
      next(exception);
    }
  };
}
const movieCtrl = new MovieController();
module.exports = movieCtrl;
