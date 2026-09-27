const { Queue } = require("bullmq");

const { redis } = require("../config/redis.config.js");

const movieTranscodingQueue = new Queue("movie-transcoding", {
  connection: redis,
});

const queueMovieTranscoding = async (movieId) => {
  return movieTranscodingQueue.add(
    "transcode",
    {
      movieId: movieId.toString(),
    },
    {
      attempts: 3,

      backoff: {
        type: "exponential",
        delay: 5000,
      },

      removeOnComplete: 100,
      removeOnFail: 100,
    },
  );
};
module.exports = {
  queueMovieTranscoding,
};
