require("dotenv").config();

const dbConnect = require("../src/config/db.config.js");
const MovieModel = require("../src/modules/movies/movies.model.js");
const { generateAudioTracks } = require("../src/services/transcode.service.js");

async function main() {
  const movieId = process.argv[2];

  if (!movieId) {
    throw new Error("Usage: node scripts/process-movie-audio.js <movieId>");
  }

  await dbConnect();

  console.log(`[Audio Repair] Processing movie ${movieId}`);

  const movie = await MovieModel.findById(movieId);

  if (!movie) {
    throw new Error(`Movie not found: ${movieId}`);
  }

  console.log(`[Audio Repair] Movie: ${movie.title || movieId}`);

  const tracks = await generateAudioTracks(movieId);

  console.log(`[Audio Repair] Generated ${tracks.length} audio track(s)`);

  console.log(JSON.stringify(tracks, null, 2));

  console.log("[Audio Repair] Finished. Video renditions were not transcoded.");
}

main().catch((error) => {
  console.error("[Audio Repair] Failed:", error);
  process.exitCode = 1;
});
