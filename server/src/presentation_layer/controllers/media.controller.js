import { GridFsFileStorage } from "../../infrastructure_layer/storage/lesson-resource-storage.js";
import { upload } from "../middlewares/resource-upload.middleware.js";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import { logger } from "../../utils/logger.js";

export function uploadImage(req, res) {
  const uploadHandler = upload.single("file");
  uploadHandler(req, res, async function (err) {
    if (err) {
      return res.status(400).jsend.fail(err.message);
    }

    if (!req.file) {
      return res.status(400).jsend.fail("No file provided");
    }

    try {
      // Upload to GridFS instead of filesystem
      const bucket = new GridFSBucket(mongoose.connection.db);
      const storage = new GridFsFileStorage(bucket);

      const savedInfo = await storage.save(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      // Return fileId as URL path - will be served via /media/download/:fileId
      const fileUrl = `/media/download/${savedInfo.fileId.toHexString()}`;

      logger.info(`Uploaded cover image to GridFS: ${fileUrl}`);

      return res.jsend.success({
        fileUrl,
        fileId: savedInfo.fileId.toHexString(),
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        size: savedInfo.size,
      });
    } catch (e) {
      logger.error(`Upload image error: ${e.message}`);
      return res.status(500).jsend.fail(e.message);
    }
  });
}

export async function downloadImage(req, res) {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).jsend.fail("File ID is required");
    }

    const bucket = new GridFSBucket(mongoose.connection.db);
    const storage = new GridFsFileStorage(bucket);

    // Convert hex string to ObjectId
    const objectId = new mongoose.Types.ObjectId(fileId);

    // Get file metadata first
    const files = await bucket.find({ _id: objectId }).toArray();
    if (files.length === 0) {
      return res.status(404).jsend.fail("File not found");
    }

    const fileInfo = files[0];
    const stream = await storage.openStream(objectId);

    res.setHeader("Content-Type", fileInfo.contentType || "application/octet-stream");
    res.setHeader("Content-Disposition", `inline; filename="${fileInfo.filename}"`);
    res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year

    stream.pipe(res);

    stream.on("error", (err) => {
      logger.error(`Stream error: ${err.message}`);
      if (!res.headersSent) {
        res.status(500).jsend.error("Failed to stream file");
      } else {
        res.end();
      }
    });
  } catch (error) {
    logger.error(`Download image error: ${error.message}`);
    if (!res.headersSent) {
      res.status(400).jsend.fail(error.message);
    }
  }
}
