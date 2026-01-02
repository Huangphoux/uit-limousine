import { Readable } from "stream";

export class GridFsFileStorage {
  constructor(bucket) {
    this.bucket = bucket;
  }

  async save(stream, filename, mimeType) {
    return new Promise((resolve) => {
      const upload = this.bucket.openUploadStream(filename, {
        contentType: mimeType,
      });

      if (Buffer.isBuffer(stream)) stream = Readable.from(stream);

      stream.pipe(upload);

      upload.on("finish", () =>
        resolve({
          fileId: upload.id,
          size: upload.length,
        })
      );
    });
  }

  async openStream(fileId) {
    // Check if file exists first
    const files = await this.bucket.find({ _id: fileId }).toArray();
    if (files.length === 0) {
      throw new Error(`File not found in storage: ${fileId}`);
    }
    return this.bucket.openDownloadStream(fileId);
  }
}
