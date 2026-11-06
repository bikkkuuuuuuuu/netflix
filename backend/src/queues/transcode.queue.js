const { Queue, FlowProducer } = require("bullmq");
const { redis } = require("../config/redis.config.js");

const TRANSCODING_1080P_QUEUE = "movie-transcoding-1080p";
const TRANSCODING_720P_QUEUE = "movie-transcoding-720p";
const TRANSCODING_480P_QUEUE = "movie-transcoding-480p";
const TRANSCODING_360P_QUEUE = "movie-transcoding-360p";

const AUDIO_QUEUE = "movie-audio";
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

const audioQueue = new Queue(AUDIO_QUEUE, { connection });

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

async function queueMovieTranscoding(movieId) {
  const id = movieId.toString();

  const childOptions = {
    ...defaultJobOptions,
    failParentOnFailure: true,
  };

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
        opts: childOptions,
      },
      {
        name: `transcode-720p-${id}`,
        queueName: TRANSCODING_720P_QUEUE,
        data: {
          movieId: id,
          profile: "720p",
        },
        opts: childOptions,
      },
      {
        name: `transcode-480p-${id}`,
        queueName: TRANSCODING_480P_QUEUE,
        data: {
          movieId: id,
          profile: "480p",
        },
        opts: childOptions,
      },
      {
        name: `transcode-360p-${id}`,
        queueName: TRANSCODING_360P_QUEUE,
        data: {
          movieId: id,
          profile: "360p",
        },
        opts: childOptions,
      },

      // Audio processing must finish before finalization.
      {
        name: `audio-${id}`,
        queueName: AUDIO_QUEUE,
        data: {
          movieId: id,
        },
        opts: childOptions,
      },

      // Subtitle processing must also finish before finalization.
      {
        name: `subtitles-${id}`,
        queueName: SUBTITLE_QUEUE,
        data: {
          movieId: id,
        },
        opts: childOptions,
      },
    ],
  });

  console.log(
    `[Transcoding] Queued video, audio, and subtitle jobs for movie ${id}`,
  );

  return flow;
}

module.exports = {
  queueMovieTranscoding,

  movieTranscoding1080pQueue,
  movieTranscoding720pQueue,
  movieTranscoding480pQueue,
  movieTranscoding360pQueue,

  audioQueue,
  subtitleQueue,
  finalizerQueue,
  movieTranscodingFlow,

  TRANSCODING_1080P_QUEUE,
  TRANSCODING_720P_QUEUE,
  TRANSCODING_480P_QUEUE,
  TRANSCODING_360P_QUEUE,

  AUDIO_QUEUE,
  SUBTITLE_QUEUE,
  FINALIZER_QUEUE,
};
