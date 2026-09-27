const mongoose = require("mongoose");
const { commonStr } = require("../common/schema");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user", "host"],
      default: "user",
    },

    image: String,
    otp: String,
    otpExpiryTime: Date,
    resetOtp: String,
    resetOtpExpiryTime: Date,
    ...commonStr,
  },
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
  },
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
