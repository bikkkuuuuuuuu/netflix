require("dotenv").config();

const { Worker } = require("bullmq");
const fs = require("node:fs/promises");
const path = require("node:path");

const { redis } = require("../src/config/redis.config.js");
const dbConnect = require("../src/config/db.config.js");
const { generateAudioTracks } = require("../src/services/transcode.service.js");

function getHlsDirectory(movieId) {
  return path.resolve(
    process.env.LOCAL_STORAGE_PATH || "./public",
    "movies",
    movieId.toString(),
    "hls",
  );
}

async function startWorker() {
  await dbConnect();

  console.log("[Audio Worker] MongoDB connected");

  const worker = new Worker(
    "movie-audio",
    async (job) => {
      const { movieId } = job.data;

      if (!movieId) {
        throw new Error("Audio job is missing movieId");
      }

      console.log(`[Audio Worker] Starting job=${job.id}, movie=${movieId}`);

      await job.updateProgress(5);

      const tracks = await generateAudioTracks(movieId);

      await job.updateProgress(90);

      if (tracks.length > 0) {
        const hlsDirectory = getHlsDirectory(movieId);

        for (const track of tracks) {
          const playlistPath = path.resolve(hlsDirectory, track.playlist);

          const relativePath = path.relative(hlsDirectory, playlistPath);

          if (
            relativePath === ".." ||
            relativePath.startsWith(`..${path.sep}`) ||
            path.isAbsolute(relativePath)
          ) {
            throw new Error(
              `Audio playlist escapes HLS directory: ${track.playlist}`,
            );
          }

          await fs.access(playlistPath);

          console.log(`[Audio Worker] Verified playlist: ${playlistPath}`);
        }
      }

      await job.updateProgress(100);

      console.log(
        `[Audio Worker] Completed movie=${movieId}, tracks=${tracks.length}`,
      );

      return {
        movieId,
        tracks,
        trackCount: tracks.length,
      };
    },
    {
      connection: redis,
      concurrency: 1,
    },
  );

  worker.on("ready", () => {
    console.log("[Audio Worker] Ready and waiting for jobs");
  });

  worker.on("active", (job) => {
    console.log(`[Audio Worker] Job ${job.id} is active:`, job.data);
  });

  worker.on("completed", (job, result) => {
    console.log(
      `[Audio Worker] Job ${job.id} completed with ${result.trackCount} tracks`,
    );
  });

  worker.on("failed", (job, error) => {
    console.error(
      `[Audio Worker] Job ${job?.id} failed:`,
      error.stack || error.message,
    );
  });

  worker.on("error", (error) => {
    console.error("[Audio Worker] Worker error:", error);
  });

  const shutdown = async () => {
    console.log("[Audio Worker] Shutting down...");

    await worker.close();

    process.exit(0);
  };

  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
}

startWorker().catch((error) => {
  console.error("[Audio Worker] Startup failed:", error);

  process.exit(1);
});
