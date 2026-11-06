require("dotenv").config();
const jwt = require("jsonwebtoken");
const authSvc = require("../modules/auth/auth.service");

const checkLogin = async (req, res, next) => {
  try {
    let token = req.headers["authorization"] || null;
    if (!token) {
      throw {
        code: 401,
        message: "Token required",
        status: "TOKEN_EXPECTED",
      };
    }
    token = token.split(" ").pop();
    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (data.typ !== "bearer") {
      throw { code: 403, message: "Invalid Token", status: "TOKEN_INVALID" };
    }
    const user = await authSvc.getSingleUserByFilter({
      _id: data.sub,
    });
    if (!user) {
      throw {
        code: 401,
        message: "User does not exist or has been deleted",
        status: "USER_NOT_FOUND",
      };
    }

    req.authUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      status: user.status,
      createdAt: user?.createdAt,
    };
    next();
  } catch (exception) {
    if (exception.name === "TokenExpiredError") {
      return next({
        code: 401,
        message: "Token has expired",
        status: "TOKEN_EXPIRED",
      });
    } else if (exception.name === "JsonWebTokenError") {
      return next({
        code: 401,
        message: exception.message,
        status: "TOKEN_ERROR",
      });
    }
    next(exception);
  }
};
const checkRefreshToken = async (req, res, next) => {
  //check login
  //next();
  let token = req.headers["refresh"] || null;
  if (!token) {
    throw {
      code: 401,
      message: "Refresh Token Required",
      status: "REFRESH_TOKEN_EXPECTED",
    };
  }
  // Bearer token=>['Bearer','token']===>'token'
  token = token.split(" ").pop();

  //verify
  const data = jwt.verify(token, process.env.JWT_SECRET);

  try {
    if (data.typ !== "refresh") {
      throw {
        code: 403,
        message: "Invalid Refresh Token",
        status: "TOKEN_INVALID",
      };
    }

    //user verify

    const user = await authSvc.getSingleUserByFilter({
      _id: data.sub,
    });
    if (!user) {
      throw {
        code: 401,
        message: "User does not exist or has been deleted",
        status: "USER_NOT_FOUND",
      };
    }

    req.authUser = {
      _id: user._id,
      name: user.name,
      role: user.role,
      email: user.email,
      image: user.image,
      status: user.status,
    };

    next();
  } catch (exception) {
    if (exception.name === "TokenExpiredError") {
      return next({
        code: 401,
        message: "Token Expired",
        status: "TOKEN_EXPIRED",
      });
    } else if (exception.name === "JsonWebTokenWebError") {
      return next({
        code: 401,
        message: exception.message,
        status: "TOKEN_ERROR",
      });
    }

    next(exception);
  }
};

module.exports = {
  checkLogin,
  checkRefreshToken,
};
