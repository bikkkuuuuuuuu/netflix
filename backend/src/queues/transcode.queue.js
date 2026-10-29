const {
  Queue,
  LEGACY_REPEATABLE_JOBS_MIGRATION_URL,
  FlowProducer,
} = require("bullmq");
const { redis } = require("../config/redis.config.js");

const profiles = ["1080p", "720p", "480p", "360p"];

const TRANSCODING_1080P_QUEUE = "movie-transcoding-1080p";
const TRANSCODING_720P_QUEUE = "movie-transcoding-720p";
const TRANSCODING_480P_QUEUE = "movie-transcoding-480p";
const TRANSCODING_360P_QUEUE = "movie-transcoding-360p";
const SUBTITLE_QUEUE = "movie-subtitles";
const FINALIZER_QUEUE = "movie-transcoding-finalizer";
const connection = redis;

const movieTranscoding1080pQueue = new Queue(TRANSCODING_1080P_QUEUE, {
  connection,
});
const movieTranscoding720pQueue = new Queue(TRANSCODING_720P_QUEUE, {
  connection,
});
const movieTranscoding480pQueue = new Queue(TRANSCODING_480P_QUEUE, {
  connection,
});
const movieTranscoding360pQueue = new Queue(TRANSCODING_360P_QUEUE, {
  connection,
});
const subtitleQueue = new Queue(SUBTITLE_QUEUE, { connection });
const finalizerQueue = new Queue(FINALIZER_QUEUE, { connection });
const movieTranscodingFlow = new FlowProducer({
  connection,
});
const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 5000,
  },
  removeOnComplete: 100,
  removeOnFail: 100,
};

const queueMovieTranscoding = async (movieId) => {
  const id = movieId.toString();
  const flow = await movieTranscodingFlow.add({
    name: `finalize-${id}`,
    queueName: FINALIZER_QUEUE,
    data: {
      movieId: id,
    },
    opts: defaultJobOptions,
    children: [
      {
        name: `transcode-1080p-${id}`,
        queueName: TRANSCODING_1080P_QUEUE,
        data: {
          movieId: id,
          profile: "1080p",
        },
        opts: {
          ...defaultJobOptions,
          failParentOnFailure: true,
        },
      },
      {
        name: `transcode-720p-${id}`,
        queueName: TRANSCODING_720P_QUEUE,
        data: {
          movieId: id,
          profile: "720p",
        },
        opts: {
          ...defaultJobOptions,
          failParentOnFailure: true,
        },
      },
      {
        name: `transcode-480p-${id}`,
        queueName: TRANSCODING_480P_QUEUE,
        data: {
          movieId: id,
          profile: "480p",
        },
        opts: {
          ...defaultJobOptions,
          failParentOnFailure: true,
        },
      },

      {
        name: `transcode-360p-${id}`,
        queueName: TRANSCODING_360P_QUEUE,
        data: {
          movieId: id,
          profile: "360p",
        },
        opts: {
          ...defaultJobOptions,
          failParentOnFailure: true,
        },
      },
      {
        name: `subtitles-${id}`,

        queueName: SUBTITLE_QUEUE,

        data: {
          movieId: id,
        },

        opts: {
          ...defaultJobOptions,

          failParentOnFailure: true,
        },
      },
    ],
  });
  return flow;
};
module.exports = {
  queueMovieTranscoding,

  movieTranscoding1080pQueue,
  movieTranscoding720pQueue,
  movieTranscoding480pQueue,
  movieTranscoding360pQueue,

  subtitleQueue,
  finalizerQueue,

  movieTranscodingFlow,

  TRANSCODING_1080P_QUEUE,
  TRANSCODING_720P_QUEUE,
  TRANSCODING_480P_QUEUE,
  TRANSCODING_360P_QUEUE,

  SUBTITLE_QUEUE,
  FINALIZER_QUEUE,
};

// const jobs = profiles.map((profile) => {
//   movieTranscodingQueue.add(
//     `transcode-${profile}`,
//     {
//       movieId: movieId.toString(),
//       profile,
//     },
//     {
//       attempts: 3,
//       backoff: {
//         type: "exponential",
//         delay: 5000,
//       },
//       removeOnComplete: 100,
//       removeOnFail: 100,
//     },
//   );
// });
// return Promise.all(LEGACY_REPEATABLE_JOBS_MIGRATION_URL);
