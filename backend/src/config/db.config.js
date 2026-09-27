require("dotenv").config();
const dns = require("node:dns/promises");
// const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require("mongoose");
const populateAdmin = require("../seeder/admin.seeder");

const dbConnect = async () => {
  try {
    console.log("db server is connecting");
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: process.env.MONGODB_DB,
      autoCreate: true,
      autoIndex: true,
    });
    console.log("Admin table seeding started....");
    await populateAdmin();
    console.log("Admin table seeding completed......");
    console.log("Database server connected successfully.............");
    return mongoose.connection;
  } catch (exception) {
    console.log("Error connectingg database.......");
    console.log(exception);
    process.exit();
  }
};
module.exports = dbConnect;
