const LocalStorage = require("./local.storage.js");
const S3Storage = require("./s3.storage.js");

let storage;

if (process.env.STORAGE_DRIVER === "s3") {
  storage = new S3Storage();
} else {
  storage = new LocalStorage();
}

module.exports = storage;
