const authRouter = require("../modules/auth/auth.router");
const bannerRouter = require("../modules/banner/banner.router");
const categoryRouter = require("../modules/category/category.router");
const movieRouter = require("../modules/movies/movies.router");
const savedRouter = require("../modules/saved/saved.router");
const watchHistoryRouter = require("../modules/watchHistory/watchHistory.router");

const router = require("express").Router();

router.use("/auth", authRouter);
router.use("/banner", bannerRouter);
router.use("/category", categoryRouter);
router.use("/saved", savedRouter);
router.use("/movies", movieRouter);
router.use("/watch-history", watchHistoryRouter);

module.exports = router;
