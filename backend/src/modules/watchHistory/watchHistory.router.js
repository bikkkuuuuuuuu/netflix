const watchHistoryRouter = require("express").Router();

const { checkLogin } = require("../../middlewares/auth.middleware");
const watchHistoryCtrl = require("./watchHistory.controller");

watchHistoryRouter.post("/", checkLogin, watchHistoryCtrl.updateProgress);
watchHistoryRouter.get("/", checkLogin, watchHistoryCtrl.continueWatching);

module.exports = watchHistoryRouter;
