const mongoose = require("mongoose");
const { commonStr } = require("../../common/schema");

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    max: 300,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  tagline: {
    type: String,
    default: null,
  },
  releaseYear: {
    type: Number,
    required: true,
  },
  runtime: {
    type: Number,
    // required: true,
  },
  maturityRating: {
    type: String,
    enum: [
      "G",
      "PG",
      "PG-13",
      "R",
      "NC-17",
      "TV-Y",
      "TV-PG",
      "TV-14",
      "TV-MA",
      "NR",
    ],
    default: "NR",
  },
  genres: [
    {
      type: String,
      index: true,
    },
  ],
  cast: [
    {
      name: String,
      character: String,
      image: String,
    },
  ],
  directors: [
    {
      type: String,
    },
  ],
  writers: [
    {
      type: String,
    },
  ],
  poster: {
    type: String,
    required: true,
  },
  backdrop: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    default: null,
  },
  trailerUrl: {
    type: String,
    default: null,
  },
  video: {
    provider: {
      type: String,
      enum: ["local", "s3", "r2", "bunny"],
      default: "local",
    },
    sourceKey: {
      type: String,
      default: null,
    },
    hlsUrl: {
      type: String,
      default: null,
    },
    dashUrl: {
      type: String,
      default: null,
    },
  },
  featured: {
    type: Boolean,
    default: false,
    index: true,
  },
  trending: {
    type: Boolean,
    default: false,
    index: true,
  },
  published: {
    type: Boolean,
    default: false,
    index: true,
  },
  premium: {
    type: Boolean,
    default: false,
  },
  processing: {
    status: {
      type: String,
      enum: ["pending", "queued", "processing", "ready", "failed"],
      default: "pending",
      index: true,
    },

    progress: {
      type: Number,
      default: 0,
    },

    error: {
      type: String,
      default: null,
    },
  },
  ...commonStr,
});

const MovieModel = mongoose.model("Movie", MovieSchema);
module.exports = MovieModel;
