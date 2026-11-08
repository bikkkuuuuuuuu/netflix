const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { NodeHttpHandler } = require("@smithy/node-http-handler");

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

    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!!accessKeyId !== !!secretAccessKey) {
      throw new Error(
        "AWS credentials are incomplete. Check AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.",
      );
    }
    this.client = new S3Client({
      region: this.region,
      ...(accessKeyId && secretAccessKey
        ? {
            credentials: {
              accessKeyId,
              secretAccessKey,
            },
          }
        : {}),

      maxAttempts: 5,
      requestHandler: new NodeHttpHandler({
        connectionTimeout: 30000,
        socketTimeout: 120000,
      }),
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

    const fileStats = await fs.stat(filePath);

    const upload = new Upload({
      client: this.client,

      params: {
        Bucket: this.bucket,
        Key: key,

        Body: fsSync.createReadStream(filePath),

        ContentLength: fileStats.size,

        ContentType:
          contentType || MIME_TYPES[extension] || "application/octet-stream",
      },

      // Multipart upload configuration.
      queueSize: 2,
      partSize: 8 * 1024 * 1024,

      // Abort incomplete multipart uploads on failure.
      leavePartsOnError: false,
    });

    try {
      const result = await upload.done();

      return {
        key,
        url: this.getPublicUrl(key),
        etag: result.ETag,
        size: fileStats.size,
      };
    } catch (error) {
      console.error(`[S3] Upload failed: ${key}`, {
        message: error.message,
        name: error.name,
        code: error.Code || error.code,
        statusCode: error.$metadata?.httpStatusCode,
      });

      throw new Error(`S3 upload failed for ${key}: ${error.message}`, {
        cause: error,
      });
    }
  }

  // UPLOAD A COMPLETE DIRECTORY RECURSIVELY.
  // Uses batches to avoid overwhelming S3.

  async getExistingObjects(prefix) {
    const existingKeys = new Set();
    let continuationToken;

    do {
      const response = await this.client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: `${prefix.replace(/\/+$/, "")}/`,
          ContinuationToken: continuationToken,
        }),
      );

      for (const item of response.Contents || []) {
        if (item.Key) {
          existingKeys.add(item.Key);
        }
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return existingKeys;
  }

  async uploadFileWithRetry(filePath, key, maxRetries = 5) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // uploadFile creates a fresh read stream on every attempt.
        return await this.uploadFile(filePath, key);
      } catch (error) {
        const cause = error.cause || error;
        const code = cause.code || cause.Code;
        const statusCode = cause.$metadata?.httpStatusCode;

        const retryable =
          [
            "ETIMEDOUT",
            "ECONNRESET",
            "ECONNREFUSED",
            "EPIPE",
            "EHOSTUNREACH",
            "TimeoutError",
            "NetworkingError",
          ].includes(code) ||
          (statusCode >= 500 && statusCode <= 599);

        if (!retryable || attempt === maxRetries) {
          throw error;
        }

        const delay = Math.min(2000 * 2 ** (attempt - 1), 30000);

        console.warn(
          `[S3] Retry ${attempt}/${maxRetries} for ${key}. ` +
            `Error: ${code || error.message}. Waiting ${delay}ms`,
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

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

    const normalizedPrefix = prefix.replace(/\/+$/, "");

    console.log(`[S3] Found ${files.length} local files`);

    // Recover completed uploads from previous attempts.
    const existingKeys = await this.getExistingObjects(normalizedPrefix);

    console.log(`[S3] Found ${existingKeys.size} existing S3 objects`);

    const uploaded = [];
    let skipped = 0;

    const BATCH_SIZE = 3;

    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);

      const results = await Promise.allSettled(
        batch.map(async (filePath) => {
          const relativePath = path.relative(directory, filePath);

          const key = [normalizedPrefix, ...relativePath.split(path.sep)].join(
            "/",
          );

          // Preserve existing files and avoid uploading them again.
          if (existingKeys.has(key)) {
            skipped++;

            return {
              key,
              url: this.getPublicUrl(key),
              skipped: true,
            };
          }

          const result = await this.uploadFileWithRetry(filePath, key, 5);

          existingKeys.add(key);

          return result;
        }),
      );

      const failures = results.filter((result) => result.status === "rejected");

      for (const result of results) {
        if (result.status === "fulfilled") {
          uploaded.push(result.value);
        }
      }

      const completed = uploaded.length;

      console.log(
        `[S3] Progress: ${completed}/${files.length} files ` +
          `(${skipped} skipped)`,
      );

      if (failures.length > 0) {
        console.error(
          `[S3] Batch failed with ${failures.length} upload errors`,
        );

        throw failures[0].reason;
      }
    }

    console.log(
      `[S3] Upload complete. Total: ${uploaded.length}, ` +
        `Skipped: ${skipped}`,
    );

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
