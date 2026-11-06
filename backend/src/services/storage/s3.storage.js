const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");

const fs = require("node:fs/promises");
const fsSync = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = path.resolve(process.env.LOCAL_STORAGE_PATH || "./public");

const MIME_TYPES = {
  ".m3u8": "application/vnd.apple.mpegurl",
  ".ts": "video/mp2t",
  ".vtt": "text/vtt",
  ".mp4": "video/mp4",
  ".mkv": "video/x-matroska",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".webm": "video/webm",
  ".aac": "audio/aac",
  ".m4a": "audio/mp4",
};

class S3Storage {
  constructor() {
    this.bucket = process.env.S3_BUCKET;
    this.region = process.env.AWS_REGION || "ap-southeast-2";

    if (!this.bucket) {
      throw new Error("S3_BUCKET is not configured.");
    }

    this.client = new S3Client({
      region: this.region,
      // Uses the standard AWS credential provider chain.
    });

    this.publicBaseUrl = (
      process.env.S3_PUBLIC_BASE_URL ||
      `https://${this.bucket}.s3.${this.region}.amazonaws.com`
    ).replace(/\/$/, "");
  }

  // LOCAL WORKSPACE METHODS
  // FFmpeg still needs real filesystem paths.

  async ensureDirectory(directory) {
    await fs.mkdir(directory, { recursive: true });
  }

  getMovieDirectory(movieId) {
    return path.join(root, "movies", movieId.toString());
  }

  getUploadPath(filename) {
    return path.join(root, "uploads", filename);
  }

  getSourceDirectory(movieId) {
    return path.join(this.getMovieDirectory(movieId), "source");
  }

  getHlsDirectory(movieId) {
    return path.join(this.getMovieDirectory(movieId), "hls");
  }

  getProfileDirectory(movieId, profileName) {
    return path.join(this.getHlsDirectory(movieId), profileName);
  }

  getSubtitleDirectory(movieId) {
    return path.join(this.getHlsDirectory(movieId), "subtitles");
  }

  getMasterPlaylistPath(movieId) {
    return path.join(this.getHlsDirectory(movieId), "master.m3u8");
  }

  async createMovieDirectories(movieId) {
    const sourceDirectory = this.getSourceDirectory(movieId);
    const hlsDirectory = this.getHlsDirectory(movieId);
    const subtitleDirectory = this.getSubtitleDirectory(movieId);

    await Promise.all([
      this.ensureDirectory(sourceDirectory),
      this.ensureDirectory(hlsDirectory),
      this.ensureDirectory(subtitleDirectory),
    ]);

    return {
      sourceDirectory,
      hlsDirectory,
      subtitleDirectory,
    };
  }

  // MOVE SOURCE VIDEO INTO LOCAL WORKSPACE.
  // Do not upload it before FFmpeg has access to it.

  async moveSourceVideo(movieId, file) {
    const sourceDirectory = this.getSourceDirectory(movieId);

    await this.ensureDirectory(sourceDirectory);

    const extension = path.extname(file.originalname) || ".mp4";
    const filename = `source${extension}`;
    const destination = path.join(sourceDirectory, filename);

    await fs.rename(file.path, destination);

    return {
      key: `movies/${movieId}/source/${filename}`,
      path: destination,
    };
  }

  // UPLOAD A SINGLE FILE TO S3

  async uploadFile(filePath, key, contentType) {
    const extension = path.extname(filePath).toLowerCase();

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: fsSync.createReadStream(filePath),
        ContentType:
          contentType || MIME_TYPES[extension] || "application/octet-stream",
      }),
    );

    return {
      key,
      url: this.getPublicUrl(key),
    };
  }

  // UPLOAD A COMPLETE DIRECTORY RECURSIVELY.
  // Uses batches to avoid overwhelming S3.

  async uploadDirectory(directory, prefix) {
    const files = [];

    const walk = async (currentDirectory) => {
      const entries = await fs.readdir(currentDirectory, {
        withFileTypes: true,
      });

      for (const entry of entries) {
        const fullPath = path.join(currentDirectory, entry.name);

        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.isFile()) {
          files.push(fullPath);
        }
      }
    };

    await walk(directory);

    const uploaded = [];

    for (let i = 0; i < files.length; i += 8) {
      const batch = files.slice(i, i + 8);

      const results = await Promise.all(
        batch.map(async (filePath) => {
          const relativePath = path.relative(directory, filePath);

          const key = [
            prefix.replace(/\/$/, ""),
            ...relativePath.split(path.sep),
          ].join("/");

          return this.uploadFile(filePath, key);
        }),
      );

      uploaded.push(...results);
    }

    return uploaded;
  }

  // UPLOAD SMALL ASSETS SUCH AS POSTERS OR BACKDROPS.

  async saveUpload(file) {
    const key = `uploads/${crypto.randomUUID()}-${path.basename(
      file.originalname,
    )}`;

    const result = await this.uploadFile(file.path, key, file.mimetype);

    await fs.unlink(file.path).catch(() => {});

    return {
      key: result.key,
      url: result.url,
    };
  }

  // DELETE A SINGLE S3 OBJECT.

  async remove(key) {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  // DELETE AN ENTIRE S3 DIRECTORY PREFIX.

  async removePrefix(prefix) {
    let continuationToken;

    do {
      const response = await this.client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }),
      );

      if (response.Contents?.length) {
        await this.client.send(
          new DeleteObjectsCommand({
            Bucket: this.bucket,
            Delete: {
              Objects: response.Contents.map((item) => ({
                Key: item.Key,
              })),
              Quiet: true,
            },
          }),
        );
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);
  }

  // PUBLIC PLAYBACK URL.

  getPublicUrl(key) {
    const encodedKey = key.split("/").map(encodeURIComponent).join("/");

    return `${this.publicBaseUrl}/${encodedKey}`;
  }

  // CLEAN LOCAL TRANSCODING FILES AFTER S3 UPLOAD.

  async removeLocalMovie(movieId) {
    await fs.rm(this.getMovieDirectory(movieId), {
      recursive: true,
      force: true,
    });
  }
}

module.exports = S3Storage;
