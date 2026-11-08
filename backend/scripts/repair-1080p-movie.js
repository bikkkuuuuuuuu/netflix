require("dotenv").config();

const dbConnect = require("../src/config/db.config.js");
const MovieModel = require("../src/modules/movies/movies.model.js");
const { transcodeProfile } = require("../src/services/transcode.service.js");

async function main() {
  const movieId = process.argv[2];

  if (!movieId) {
    throw new Error("Usage: node scripts/repair-movie-1080p.js <movieId>");
  }

  await dbConnect();

  console.log("[1080p Repair] MongoDB connected");

  const movie = await MovieModel.findById(movieId);

  if (!movie) {
    throw new Error(`Movie not found: ${movieId}`);
  }

  console.log(`[1080p Repair] Movie: ${movie.title || movieId}`);

  console.log("[1080p Repair] Starting 1080p transcoding...");

  // Exactly the same function and profile used by your BullMQ worker.
  await transcodeProfile(movieId, "1080p");

  console.log(`[1080p Repair] Successfully completed 1080p for ${movieId}`);

  console.log("[1080p Repair] Existing encoding settings preserved.");
}

main().catch((error) => {
  console.error("[1080p Repair] Failed:", error);
  process.exitCode = 1;
});
