const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const fs = require("node:fs");

class S3Storage {
  constructor() {
    this.bucket = process.env.S3_BUCKET;

    this.client = new S3Client({
      region: process.env.AWS_REGION,
    });
  }

  async saveUpload(file) {
    const key = `uploads/${crypto.randomUUID()}-${file.originalname}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: fs.createReadStream(file.path),
        ContentType: file.mimetype,
      }),
    );

    return {
      key,
    };
  }

  async uploadFile(filePath, key, contentType) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: fs.createReadStream(filePath),
        ContentType: contentType,
      }),
    );
  }

  async remove(key) {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  getPublicUrl(key) {
    return `${process.env.S3_PUBLIC_BASE_URL}/${key}`;
  }
}

module.exports = S3Storage;
