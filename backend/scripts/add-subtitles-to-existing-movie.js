require("dotenv").config();

const fs = require("node:fs/promises");
const path = require("node:path");

const movieId = process.argv[2];

if (!movieId) {
  console.error(
    "Usage: node scripts/add-subtitles-to-existing-movie.js <movieId>",
  );
  process.exit(1);
}

function getLanguage(filename) {
  const base = path.basename(filename, ".vtt");
  const match = base.match(/^([a-z]{2,3})(?:[-_].*)?$/i);

  return match ? match[1].toLowerCase() : "und";
}

function getDisplayName(filename, language) {
  const base = path.basename(filename, ".vtt");

  if (language === "und") return base;

  return base
    .replace(/^([a-z]{2,3})/i, language.toUpperCase())
    .replace(/[-_]/g, " ");
}

async function main() {
  const storageRoot = path.resolve(
    process.env.LOCAL_STORAGE_PATH || "./public",
  );

  const hlsDirectory = path.join(storageRoot, "movies", movieId, "hls");

  const subtitlesDirectory = path.join(hlsDirectory, "subtitles");

  const masterPath = path.join(hlsDirectory, "master.m3u8");

  let master = await fs.readFile(masterPath, "utf8");

  const files = await fs.readdir(subtitlesDirectory, {
    withFileTypes: true,
  });

  const subtitleFiles = files
    .filter((file) => file.isFile() && file.name.toLowerCase().endsWith(".vtt"))
    .map((file) => file.name);

  if (!subtitleFiles.length) {
    throw new Error(`No .vtt subtitle files found in ${subtitlesDirectory}`);
  }

  const tracks = [];

  for (const filename of subtitleFiles) {
    const language = getLanguage(filename);
    const name = getDisplayName(filename, language);

    const vttPath = path.join(subtitlesDirectory, filename);
    const content = await fs.readFile(vttPath, "utf8");

    if (!content.trimStart().startsWith("WEBVTT")) {
      console.warn(`Skipping invalid VTT: ${filename}`);
      continue;
    }

    const endMatches = [
      ...content.matchAll(/-->\s*(?:(\d+):)?(\d{2}):(\d{2})\.(\d{3})/g),
    ];

    if (!endMatches.length) {
      console.warn(`Skipping VTT without cues: ${filename}`);
      continue;
    }

    const duration = Math.max(
      1,
      Math.ceil(
        Math.max(
          ...endMatches.map(
            (match) =>
              Number(match[1] || 0) * 3600 +
              Number(match[2]) * 60 +
              Number(match[3]) +
              Number(match[4]) / 1000,
          ),
        ),
      ),
    );

    const playlistFilename = `${path.basename(filename, ".vtt")}.m3u8`;

    const playlistPath = path.join(subtitlesDirectory, playlistFilename);

    const playlist = [
      "#EXTM3U",
      "#EXT-X-VERSION:3",
      `#EXT-X-TARGETDURATION:${duration}`,
      "#EXT-X-MEDIA-SEQUENCE:0",
      `#EXTINF:${duration}.000,`,
      filename,
      "#EXT-X-ENDLIST",
      "",
    ].join("\n");

    await fs.writeFile(playlistPath, playlist, "utf8");

    tracks.push({
      filename,
      language,
      name,
      playlist: `subtitles/${playlistFilename}`,
    });

    console.log(`Prepared subtitle: ${filename}`);
  }

  if (!tracks.length) {
    throw new Error("No valid subtitle tracks were found.");
  }

  // Remove previously generated subtitle entries to prevent duplicates.
  const lines = master.split(/\r?\n/);

  const filteredLines = [];
  let skipNextStream = false;

  for (const line of lines) {
    if (line.startsWith("#EXT-X-MEDIA:TYPE=SUBTITLES")) {
      continue;
    }

    if (line.startsWith("#EXT-X-STREAM-INF:")) {
      skipNextStream = true;

      filteredLines.push(line.replace(/,?SUBTITLES="[^"]*"/g, ""));

      continue;
    }

    if (skipNextStream) {
      filteredLines.push(line);
      skipNextStream = false;
      continue;
    }

    filteredLines.push(line);
  }

  const subtitleEntries = tracks.map((track) => {
    return [
      "#EXT-X-MEDIA:TYPE=SUBTITLES",
      'GROUP-ID="subs"',
      `NAME="${track.name.replace(/"/g, "")}"`,
      `LANGUAGE="${track.language}"`,
      "DEFAULT=NO",
      "AUTOSELECT=YES",
      `URI="${track.playlist}"`,
    ].join(",");
  });

  const insertionIndex = filteredLines.findIndex((line) =>
    line.startsWith("#EXT-X-STREAM-INF:"),
  );

  if (insertionIndex === -1) {
    throw new Error("No video variants found in master playlist.");
  }

  filteredLines.splice(insertionIndex, 0, ...subtitleEntries, "");

  const updatedLines = filteredLines.map((line) => {
    if (!line.startsWith("#EXT-X-STREAM-INF:")) {
      return line;
    }

    return `${line},SUBTITLES="subs"`;
  });

  const updatedMaster = `${updatedLines.join("\n").trim()}\n`;

  const temporaryPath = `${masterPath}.tmp`;

  await fs.writeFile(temporaryPath, updatedMaster, "utf8");
  await fs.rename(temporaryPath, masterPath);

  console.log("\nSubtitle registration completed.");
  console.log(`Movie: ${movieId}`);
  console.log(`Subtitle tracks: ${tracks.length}`);

  for (const track of tracks) {
    console.log(`- ${track.name} (${track.language})`);
  }

  console.log(`Master playlist: ${masterPath}`);
}

main().catch((error) => {
  console.error("Subtitle registration failed:", error);
  process.exit(1);
});
