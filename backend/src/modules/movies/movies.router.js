const { checkLogin } = require("../../middlewares/auth.middleware");
const uploader = require("../../middlewares/multipart-parser.middleware");
const { allowRole } = require("../../middlewares/rbac.middleware");
const movieCtrl = require("./movies.controller");

const movieRouter = require("express").Router();

const upload = uploader("movie");
movieRouter.get("/home", movieCtrl.getForHome);
movieRouter.get("/suggested", checkLogin, movieCtrl.suggested);

movieRouter.post(
  "/upload",
  checkLogin,
  allowRole("admin"),
  upload.fields([
    {
      name: "poster",
      maxCount: 1,
    },
    {
      name: "backdrop",
      maxCount: 1,
    },
    {
      name: "logo",
      maxCount: 1,
    },
    {
      name: "video",
      maxCount: 1,
    },
  ]),
  movieCtrl.create,
);
movieRouter.get("/list", checkLogin, allowRole("admin"), movieCtrl.index);

movieRouter
  .route("/:id")
  .get(checkLogin, allowRole(["admin", "user"]), movieCtrl.detail)
  .patch(
    checkLogin,
    allowRole("admin"),
    upload.fields([
      {
        name: "poster",
        maxCount: 1,
      },
      {
        name: "backdrop",
        maxCount: 1,
      },
      {
        name: "logo",
        maxCount: 1,
      },
      {
        name: "video",
        maxCount: 1,
      },
    ]),
    movieCtrl.update,
  )
  .delete(checkLogin, allowRole("admin"), movieCtrl.delete);

module.exports = movieRouter;
