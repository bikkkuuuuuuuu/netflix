const authSvc = require("./auth.service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const notificationSvc = require("../notifications/notification.service");

class AuthController {
  register = async (req, res, next) => {
    try {
      let data = await authSvc.transformUserRegister(req);
      const user = await authSvc.createUser(data);

      await authSvc.sendActivationNotification(data.name, data.otp, data.email);
      res.json({
        data: user,
        message: "User registerd",
        status: "REGISTRATION_SUCCESS",
        options: null,
      });
    } catch (exception) {
      console.log("Register contoller : ", exception);
      next(exception);
    }
  };
  activateUser = async (req, res, next) => {
    try {
      const data = req.body;
      const user = await authSvc.getSingleUserByFilter({
        email: data.email,
      });
      if (user.status === "active") {
        throw {
          code: 400,
          message: "User already activated",
          status: "ALREADY_ACTIVATED_USER",
        };
      }
      let today = Date.now();
      let otpExpiryTime = user.otpExpiryTime.getTime();
      if (today > otpExpiryTime) {
        throw { code: 422, message: "OTP expired", status: "OTP_EXPIRED" };
      }
      if (data.otp !== user.otp) {
        throw { code: 403, message: "Invalid OTP code", status: "OTP_INVALID" };
      }
      await authSvc.activateUser(user);

      // const notification = await notificationSvc.create({
      //     user: user._id,
      //     type: "system",
      //     title: "Profile Created",
      //     message: `Welcome, ${user.name}. We will keep up with you throught your achivement journey.`,
      // })

      res.json({
        detail: null,
        message: "User Activated Successfully",
        status: "ACTIVATED_USER_SUCCESSFULLY",
        options: null,
      });
    } catch (exception) {
      console.log("Activate User exception controller ", exception);
      next(exception);
    }
  };
  login = async (req, res, next) => {
    try {
      const data = req.body;
      const user = await authSvc.getSingleUserByFilter({
        email: data.email,
      });
      if (user.status !== "active") {
        return res.status(400).json({
          status: 400,
          message: "User not activated",
          status: "USER_NOT_ACTIVE",
        });
      }
      if (bcrypt.compareSync(data.password, user.password)) {
        let accessToken = jwt.sign(
          {
            sub: user._id,
            typ: "bearer",
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          },
        );
        let refreshToken = jwt.sign(
          {
            sub: user._id,
            typ: "refresh",
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "10d",
          },
        );
        res.json({
          detail: {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: {
              _id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              image: user.image,
            },
          },
          message: "Login Successfull",
          status: "LOGIN_SUCCESSFULL",
          options: null,
        });
      } else {
        throw {
          code: 401,
          message: "Invalid Password",
          status: "INVALID_PASSWORD",
        };
      }
    } catch (exception) {
      console.log("Login exception controller ", exception);
      next(exception);
    }
  };
  getLoggedInUser = async (req, res, next) => {
    try {
      res.json({
        detail: req.authUser,
        message: "Your profile",
        status: "YOUR_PROFILE",
        options: null,
      });
    } catch (exception) {
      console.log("Get logged in user exception controller ", exception);
      next(exception);
    }
  };
  listUsers = async (req, res, next) => {
    try {
      const id = req.authUser._id;
      let filter = { _id: { $ne: id } };

      const response = await authSvc.getAllUsersByFilter(filter);
      res.json({
        detail: response,
        message: "Users List",
        status: "USERS_LIST",
        options: null,
      });
    } catch (exception) {
      console.log("List all users exception controller", exception);
      next(exception);
    }
  };

  resendOtp = async (req, res, next) => {
    try {
      const data = req.body;
      let user = await authSvc.getSingleUserByFilter({
        email: data.email,
      });
      if (user.status === "active") {
        throw {
          code: 400,
          message: "User already activated",
          status: "ALREADY_ACTIVATED_USER",
        };
      }
      let today = Date.now();
      let otpExpiry = user.otpExpiryTime.getTime();

      if (today <= otpExpiry) {
        throw { code: 422, message: "OTP expired", status: "OTP_EXPIRED" };
      }
      user = await authSvc.resetOtp(user);
      await authSvc.sendActivationNotification(user.name, user.otp, user.email);
      res.json({
        detail: null,
        status: "OTP_RESEND",
        message: "OTP resend successfully",
        options: null,
      });
    } catch (exception) {
      console.log("List all users exception controller", exception);
      next(exception);
    }
  };

  forgot = async (req, res, next) => {
    try {
      const data = req.body;
      const email = data.email;

      const user = await authSvc.getSingleUserByFilter({ email: email });
      if (user.status === "inactive") {
        throw {
          code: 400,
          message: "User email not verified",
          status: "EMAIL_NOT_VERIFIED",
        };
      }

      await authSvc.forgotPassword(user, data);

      res.json({
        detail: null,
        message: "Reset Code sent Successfully",
        status: "FORGOT_PASSWORD",
        options: null,
      });
    } catch (exception) {
      console.log("List all users exception controller", exception);
      next(exception);
    }
  };

  update = async (req, res, next) => {
    try {
      const user = req.authUser;
      if (!user) {
        throw {
          code: 400,
          message: "User not found",
          status: "USER_NOT_FOUND",
        };
      }
      if (user.status === "inactive") {
        throw {
          code: 400,
          message: "User email not verified",
          status: "EMAIL_NOT_VERIFIED",
        };
      }
      const transformData = await authSvc.transformUpdateRequest(req);
      const response = await authSvc.updateByFilter(
        {
          _id: user._id,
        },
        transformData,
      );

      res.json({
        message: "User update successfully",
        status: "USER_UPDATE_SUCCESS",
        options: null,
      });
    } catch (exception) {
      console.log("Udate Profile exception controller", exception);
      next(exception);
    }
  };

  verifyResetCode = async (req, res, next) => {
    try {
      const data = req.body;
      const user = await authSvc.getSingleUserByFilter({
        email: data.email,
      });

      let today = Date.now();
      let otpExpiryTime = user.resetOtpExpiryTime.getTime();
      if (today > otpExpiryTime) {
        throw { code: 422, message: "OTP expired", status: "OTP_EXPIRED" };
      }
      if (data.otp !== user.resetOtp) {
        throw { code: 403, message: "Invalid OTP code", status: "OTP_INVALID" };
      }

      let accessToken = jwt.sign(
        {
          sub: user._id,
          typ: "bearer",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        },
      );

      res.json({
        detail: {
          accessToken: accessToken,
          user: {
            _id: user.id,
            email: user.email,
            name: user.name,
          },
        },
        message: "Code verified Successfully",
        status: "CODE_VERIFIED_SUCCESSFULLY",
        options: null,
      });
    } catch (exception) {
      console.log("Activate User exception controller ", exception);
      next(exception);
    }
  };

  resetpass = async (req, res, next) => {
    try {
      const data = req.body;
      const user = req.authUser;

      const response = await authSvc.resetPassword(user, data);

      res.json({
        detail: null,
        message: "Password Reset Success",
        status: "RESET_PASSWORD",
        options: null,
      });
    } catch (exception) {
      console.log(exception);
      next(exception);
    }
  };

  googleSignIn = async (req, res, next) => {
    try {
      let accessToken = jwt.sign(
        {
          sub: req.user._id,
          typ: "bearer",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        },
      );
      // let refreshToken = jwt.sign({
      //     sub: req.user._id,
      //     typ: 'refresh'
      // }, process.env.JWT_SECRET, {
      //     expiresIn: '10d'
      // })
      res.redirect(
        `${process.env.CLIENT_URL}auth-success?accessToken=${accessToken}`,
      );
    } catch (exception) {
      console.log("Google Sign In Exception : ", exception);
      res.redirect(`${process.env.CLIENT_URL}login?error=google_failed`);
      next(exception);
    }
  };
  facebookSignIn = async (req, res, next) => {
    try {
      let accessToken = jwt.sign(
        {
          sub: req.user._id,
          typ: "bearer",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        },
      );
      // let refreshToken = jwt.sign({
      //     sub: req.user._id,
      //     typ: 'refresh'
      // }, process.env.JWT_SECRET, {
      //     expiresIn: '10d'
      // })
      res.redirect(
        `${process.env.CLIENT_URL}auth-success?accessToken=${accessToken}`,
      );
    } catch (exception) {
      console.log("Google Sign In Exception : ", exception);
      res.redirect(`${process.env.CLIENT_URL}login?error=facebook_failed`);
      next(exception);
    }
  };
}

const authCtrl = new AuthController();
module.exports = authCtrl;
