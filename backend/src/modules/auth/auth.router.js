const {
  checkLogin,
  checkRefreshToken,
} = require("../../middlewares/auth.middleware");
const { bodyValidator } = require("../../middlewares/bodyvalidator.middleware");
const uploader = require("../../middlewares/multipart-parser.middleware");
const { allowRole } = require("../../middlewares/rbac.middleware");
const authCtrl = require("./auth.controller");
const passport = require("passport");
const {
  registerDataDTO,
  activationDTO,
  loginDTO,
  forgotDTO,
  ProfileUpdateDTO,
  resetPassDTO,
} = require("./auth.validator");

const authRouter = require("express").Router();

authRouter.post(
  "/register",
  uploader().single("image"),
  bodyValidator(registerDataDTO),
  authCtrl.register,
);
authRouter.post(
  "/activate",
  bodyValidator(activationDTO),
  authCtrl.activateUser,
);
authRouter.post("/login", bodyValidator(loginDTO), authCtrl.login);
authRouter.get("/me", checkLogin, authCtrl.getLoggedInUser);
authRouter.get("/list-users", checkLogin, authCtrl.listUsers);
authRouter.post("/forgot-password", bodyValidator(forgotDTO), authCtrl.forgot);
authRouter.post(
  "/verify-resetcode",
  bodyValidator(activationDTO),
  authCtrl.verifyResetCode,
);
authRouter.post("/resend-otp", bodyValidator(forgotDTO), authCtrl.resendOtp);
authRouter.post(
  "/reset-password",
  checkLogin,
  allowRole(["admin", "host", "user"]),
  bodyValidator(resetPassDTO),
  authCtrl.resetpass,
);
authRouter.patch(
  "/update",
  checkLogin,
  allowRole(["admin", "host", "user"]),
  uploader().single("image"),
  bodyValidator(ProfileUpdateDTO),
  authCtrl.update,
);
authRouter.get("/refresh", checkRefreshToken, authCtrl.getRefreshToken);

//Step-1 :Redirect to google login
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authCtrl.googleSignIn,
);

authRouter.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["public_profile", "email"] }),
);

authRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  authCtrl.facebookSignIn,
);

module.exports = authRouter;
