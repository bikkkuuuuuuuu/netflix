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
      const {
        category,
        type,
        sort = "newest",
        year,
        from,
        to,
        limit = 10,
        exclude,
      } = req.query;
      console.log(req.query);
      let filter = {
        $and: [{ "processing.status": "ready" }],
      };

      if (category) {
        filter.genres = {
          $in: Array.isArray(category) ? category : category.split(","),
        };
      }
      if (type) {
        filter.type = type;
      }
      if (year) {
        filter.releaseYear = Number(year);
      }
      if (from || to) {
        filter.createdAt = {};

        if (from) {
          filter.createdAt.$gte = new Date(from);
        }

        if (to) {
          filter.createdAt.$lte = new Date(to);
        }
      }
      if (exclude) {
        filter._id = {
          $nin: exclude.split(","),
        };
      }
      const sortOptions = {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        recentlyUpdated: { updatedAt: -1 },
        releaseDate: { releaseDate: -1 },
        alphabetical: { title: 1 },
      };
      const sortBy = sortOptions[sort] || sortOptions.newest;
      const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
      const listMovie = await movieSvc.listAllMovie({
        skip: 0,
        limit: safeLimit,
        filter,
        sort: sortBy,
      });
      res.json({
        detail: listMovie,
        message: "Movie list successfully",
        status: "MOVIE_LIST_SUCCESS",
        options: {
          limit: safeLimit,
          sort,
          filters: {
            category,
            type,
            year,
            from,
            to,
          },
        },
      });
    } catch (exception) {
      console.log("Movie getForHome controller exception ", exception);
      next(exception);
    }
  };

  suggested = async (req, res, next) => {
    try {
      console.log(req.authUser);
      const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);
      const data = await movieSvc.getSuggestedMovies(req.authUser._id, limit);

      res.json({
        detail: data,
        message: "Suggested movies fetched successfully",
        status: "SUGGESTED_MOVIES_SUCCESS",
        options: null,
      });
    } catch (exception) {
      console.log("Movie suggested controller exception:", exception);
      next(exception);
    }
  };
}
const movieCtrl = new MovieController();
module.exports = movieCtrl;
