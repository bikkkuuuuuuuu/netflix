const fileUploaderSvc = require("../../services/fileuploader.service");
const MovieModel = require("./movies.model");
const storage = require("../../services/storage/storage.factory");
const { queueMovieTranscoding } = require("../../queues/transcode.queue");
const fs = require("node:fs/promises");
const slugify = require("slugify");
const WatchHistoryModel = require("../watchHistory/watchHistory.model");
const { buildPreferences, calculateMatch } = require("../../utilities/helper");

class MovieService {
  transformCreateRequest = async (req) => {
    try {
      let data = req.body;
      console.log(data);
      const files = req.files || {};
      data.slug = slugify(data.title, {
        lower: true,
      });
      // const existingMovie = await this.getSingleByFilter({ slug: data.slug });
      // if (existingMovie) {
      //   throw {
      //     code: 409,
      //     detail: {
      //       slug: "Movie with this slug already exists",
      //     },
      //     message: "Movie already exists",
      //     status: "MOVIE_ALREADY_EXISTS",
      //   };
      // }
      const poster = files.poster?.[0];
      const backdrop = files.backdrop?.[0];
      const logo = files.logo?.[0];
      const video = files.video?.[0];

      if (!poster) {
        throw {
          code: 400,
          detail: {
            poster: "Poster is required",
          },
          message: "Validation failed",
          status: "VALIDATION_FAILED",
        };
      }

      if (!backdrop) {
        throw {
          code: 400,
          detail: {
            backdrop: "Backdrop is required",
          },
          message: "Validation failed",
          status: "VALIDATION_FAILED",
        };
      }

      if (!video) {
        throw {
          code: 400,
          detail: {
            video: "Video is required",
          },
          message: "Validation failed",
          status: "VALIDATION_FAILED",
        };
      }

      // data.image = await fileUploaderSvc.uploadFile(image.path, "/movie");

      data.createdBy = req.authUser._id;
      return {
        data,
        poster,
        backdrop,
        logo,
        video,
      };
    } catch (exception) {
      console.log("transformCreateRequest service exception : ", exception);
      throw exception;
    }
  };
  createMovie = async ({ data, poster, backdrop, logo, video }) => {
    try {
      const movieId = new MovieModel()._id;
      await storage.createMovieDirectories(movieId);
      const posterFile = await this.saveImage(poster, movieId, "poster");
      const backdropFile = await this.saveImage(backdrop, movieId, "backdrop");
      let logoUrl = null;
      if (logo) {
        const logoFile = await this.saveImage(logo, movieId, "logo");
        logoUrl = storage.getPublicUrl(logoFile.key);
      }
      const source = await storage.moveSourceVideo(movieId, video);

      const movie = new MovieModel({
        _id: movieId,
        title: data.title,
        slug: data.slug,
        description: data.description,
        tagline: data.tagline || null,
        releaseYear: Number(data.releaseYear),
        runtime: Number(data?.runtime || 0),
        maturityRating: data.maturityRating || "NR",
        genres: this.parseArray(data.genres),
        cast: this.parseCast(data.cast),
        directors: this.parseArray(data.directors),
        writers: this.parseArray(data.writers),
        trailerUrl: data.trailerUrl || null,
        featured: this.parseBoolean(data.featured),
        trending: this.parseBoolean(data.trending),
        published: false,
        premium: this.parseBoolean(data.premium),
        poster: storage.getPublicUrl(posterFile.key),
        backdrop: storage.getPublicUrl(backdropFile.key),
        logo: logoUrl,
        video: {
          provider: "local",
          sourceKey: source.key,
          hlsUrl: null,
          dashUrl: null,
        },
        createdBy: data.createdBy,
        processing: {
          status: "queued",
          progress: 0,
          error: null,
        },
      });
      await movie.save();
      await queueMovieTranscoding(movie._id);
      return movie;
    } catch (exception) {
      console.log("createMovie service exception : ", exception);
      throw exception;
    }
  };
  listAllMovie = async ({
    skip = 0,
    limit = 10,
    filter = {},
    sort = { created: -1 },
  }) => {
    try {
      let data = await MovieModel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

      return data;
    } catch (exception) {
      console.log("listAllMovie service exception : ", exception);
      throw exception;
    }
  };
  countData = async (filter = {}) => {
    try {
      return await MovieModel.countDocuments(filter);
    } catch (exception) {
      console.log("countData service exception : ", exception);
      throw exception;
    }
  };
  getSingleByFilter = async (filter) => {
    try {
      const data = await MovieModel.findOne(filter)
        .populate("createdBy", ["_id", "name", "email", "status", "image"])
        .populate("updatedBy", ["_id", "name", "email", "status", "image"]);

      if (!data) {
        throw {
          code: 404,
          message: "Movie does not exist",
          status: "MOVIE_NOT_FOUND",
        };
      }
      return data;
    } catch (exception) {
      console.log("getSingleByFilter service exception : ", exception);
      throw exception;
    }
  };
  transformUpdateRequest = async (req, movieData) => {
    try {
      let data = req.body;
      if (req.file) {
        data.image = await fileUploaderSvc.uploadFile(req.file.path, "/movie");
      } else {
        data.image = movieData.image;
      }
      data.updatedBy = req.authUser._id;
      return data;
    } catch (exception) {
      console.log("transformUpdateRequest service exception : ", exception);
      throw exception;
    }
  };
  updateByFilter = async (filter, updateData) => {
    try {
      const response = await MovieModel.findOneAndUpdate(filter, {
        $set: updateData,
      });
      return response;
    } catch (exception) {
      console.log("updateByFilter service exception : ", exception);
      throw exception;
    }
  };
  deleteByFilter = async (filter) => {
    try {
      const response = await MovieModel.findOneAndDelete(filter);
      return response;
    } catch (exception) {
      console.log("deleteByFilter service exception : ", exception);
      throw exception;
    }
  };

  saveImage = async (file, movieId, name) => {
    const movieDirectory = storage.getMovieDirectory(movieId);
    const imageDirectory = `${movieDirectory}/images`;
    await storage.ensureDirectory(imageDirectory);
    const extension = file.originalname.split(".").pop() || "jpg";
    const filename = `${name}.${extension}`;
    const destination = `${imageDirectory}/${filename}`;
    await fs.rename(file.path, destination);
    return {
      key: `movies/${movieId}/images/${filename}`,
      path: destination,
    };
  };

  parseCast = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value.map((name) => ({
        name: name.trim(),
      }));
    }

    return value
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => ({
        name,
      }));
  };
  parseArray = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }

    return String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  parseBoolean = (value) => {
    if (typeof value === "boolean") {
      return value;
    }

    if (value === undefined || value === null || value === "") {
      return false;
    }

    return ["true", "1", "yes", "on"].includes(
      String(value).trim().toLowerCase(),
    );
  };

  getSuggestedMovies = async (userId, limit = 20) => {
    // 1. Get the user's recent viewing history.
    const history = await WatchHistoryModel.find({
      user: userId,
    })
      .sort({ lastWatchedAt: -1 })
      .limit(40)
      .populate({
        path: "movie",
        select: "genres cast directors releaseYear",
      })
      .lean();

    // 2. Exclude movies already watched.
    const watchedMovieIds = history
      .map((item) => item.movie?._id?.toString())
      .filter(Boolean);

    // 3. Get candidate movies.
    const candidates = await MovieModel.find({
      published: true,

      _id: { $nin: watchedMovieIds },
    })
      .sort({
        trending: -1,
        featured: -1,
        createdAt: -1,
      })
      .limit(300)
      .lean();

    if (!candidates.length) return [];

    // 4. No history? Return a useful discovery feed.
    if (!history.length) {
      return candidates.slice(0, limit).map((movie) => ({
        ...movie,
        recommendationScore: 0,
        recommendationReason: movie.trending
          ? "Trending now"
          : movie.featured
            ? "Featured movie"
            : "Recently added",
      }));
    }

    // 5. Build the user's preference profile.
    const preferences = buildPreferences(history);

    const recentMovies = history
      .filter((item) => item.movie)
      .slice(0, 5)
      .map((item) => item.movie);

    const preferredYear =
      recentMovies.length > 0
        ? recentMovies.reduce(
            (sum, movie) => sum + (movie.releaseYear || 0),
            0,
          ) / recentMovies.length
        : null;

    // 6. Score each candidate.
    const scoredMovies = candidates.map((movie) => {
      const genreScore = calculateMatch(movie.genres, preferences.genres);

      const castScore = calculateMatch(
        movie.cast?.map((person) => person.name).filter(Boolean),
        preferences.cast,
      );

      const directorScore = calculateMatch(
        movie.directors,
        preferences.directors,
      );

      const yearScore =
        preferredYear && movie.releaseYear
          ? Math.max(0, 100 - Math.abs(movie.releaseYear - preferredYear) * 5)
          : 0;

      const trendingScore = movie.trending ? 100 : 0;
      const recencyScore = movie.featured ? 70 : 30;

      const score =
        genreScore * 0.4 +
        castScore * 0.2 +
        directorScore * 0.15 +
        trendingScore * 0.1 +
        recencyScore * 0.1 +
        yearScore * 0.05;

      let recommendationReason = "Picked for you";

      if (genreScore >= 50) {
        recommendationReason = `Because you enjoy ${movie.genres?.[0] || "similar"} movies`;
      } else if (directorScore > 0) {
        recommendationReason = "From a director you've watched";
      } else if (castScore > 0) {
        recommendationReason = "Featuring familiar cast members";
      } else if (movie.trending) {
        recommendationReason = "Trending now";
      }

      return {
        ...movie,
        recommendationScore: Math.round(score),
        recommendationReason,
      };
    });

    // 7. Highest match first.
    return scoredMovies
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit);
  };
}
const movieSvc = new MovieService();
module.exports = movieSvc;
