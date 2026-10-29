require("dotenv").config();

const { Worker } = require("bullmq");

const fs = require("node:fs/promises");
const path = require("node:path");

const { redis } = require("../src/config/redis.config.js");

const dbConnect = require("../src/config/db.config.js");

const MovieModel = require("../src/modules/movies/movies.model.js");

function getHlsDirectory(movieId) {
  return path.resolve(
    process.env.LOCAL_STORAGE_PATH || "./public",
    "movies",
    movieId.toString(),
    "hls",
  );
}

async function ensureProfileExists(movieId, profile) {
  const playlistPath = path.join(
    getHlsDirectory(movieId),
    profile,
    "index.m3u8",
  );

  try {
    await fs.access(playlistPath);
  } catch {
    throw new Error(`${profile} playlist does not exist: ${playlistPath}`);
  }

  return playlistPath;
}

async function createMasterPlaylist(movieId) {
  const hlsDirectory = getHlsDirectory(movieId);

  await fs.mkdir(hlsDirectory, {
    recursive: true,
  });

  /*
   * Verify that every profile
   * actually produced its playlist.
   */
  await ensureProfileExists(movieId, "1080p");

  await ensureProfileExists(movieId, "720p");

  await ensureProfileExists(movieId, "480p");

  await ensureProfileExists(movieId, "360p");

  const content = `#EXTM3U
#EXT-X-VERSION:3

#EXT-X-STREAM-INF:BANDWIDTH=5192000,AVERAGE-BANDWIDTH=5192000,RESOLUTION=1920x1080,CODECS="avc1.640028,mp4a.40.2"
1080p/index.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=3128000,AVERAGE-BANDWIDTH=3128000,RESOLUTION=1280x720,CODECS="avc1.64001f,mp4a.40.2"
720p/index.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=1628000,AVERAGE-BANDWIDTH=1628000,RESOLUTION=854x480,CODECS="avc1.64001f,mp4a.40.2"
480p/index.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=896000,AVERAGE-BANDWIDTH=896000,RESOLUTION=640x360,CODECS="avc1.640015,mp4a.40.2"
360p/index.m3u8
`;

  const masterPath = path.join(hlsDirectory, "master.m3u8");

  await fs.writeFile(masterPath, content, "utf8");

  return masterPath;
}

async function startWorker() {
  await dbConnect();

  console.log("[Finalizer] MongoDB connected");

  const worker = new Worker(
    "movie-transcoding-finalizer",

    async (job) => {
      const { movieId } = job.data;

      console.log(`[Finalizer] Processing movie ${movieId}`);

      /*
       * If this worker runs, BullMQ has
       * successfully completed all child
       * jobs.
       */
      const masterPath = await createMasterPlaylist(movieId);

      console.log(`[Finalizer] Master playlist created: ${masterPath}`);

      const movie = await MovieModel.findById(movieId);

      if (!movie) {
        throw new Error(`Movie ${movieId} not found`);
      }

      movie.video.hlsUrl = `/movies/${movieId}/hls/master.m3u8`;

      movie.processing.status = "ready";

      movie.processing.progress = 100;

      movie.processing.error = null;

      await movie.save();

      console.log(`[Finalizer] Movie ${movieId} is READY`);

      return {
        movieId,
        masterPlaylist: `/movies/${movieId}/hls/master.m3u8`,
      };
    },

    {
      connection: redis,
      concurrency: 1,
    },
  );

  worker.on("ready", () => {
    console.log("[Finalizer] Ready");
  });

  worker.on("completed", (job) => {
    console.log(`[Finalizer] Job ${job.id} completed`);
  });

  worker.on("failed", async (job, error) => {
    console.error(`[Finalizer] Job ${job?.id} failed: ${error.message}`);

    const movieId = job?.data?.movieId;

    if (!movieId) {
      return;
    }

    try {
      await MovieModel.findByIdAndUpdate(movieId, {
        $set: {
          "processing.status": "failed",

          "processing.error": error.message,
        },
      });
    } catch (updateError) {
      console.error("[Finalizer] Failed to update movie:", updateError);
    }
  });

  worker.on("error", (error) => {
    console.error("[Finalizer] Worker error:", error);
  });

  const shutdown = async () => {
    console.log("[Finalizer] Shutting down...");

    await worker.close();

    process.exit(0);
  };

  process.on("SIGTERM", shutdown);

  process.on("SIGINT", shutdown);
}

startWorker().catch((error) => {
  console.error("[Finalizer] Startup failed:", error);

  process.exit(1);
});
