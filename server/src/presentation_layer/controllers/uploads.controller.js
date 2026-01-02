import { GridFsFileStorage } from "../../infrastructure_layer/storage/lesson-resource-storage.js";
import { logger } from "../../utils/logger.js";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

export async function uploadFilesController(req, res) {
  try {
    logger.debug("Calling uploadFilesController");

    if (!req.files || req.files.length === 0) throw Error("No files provided");

    const bucket = new GridFSBucket(mongoose.connection.db);
    const storage = new GridFsFileStorage(bucket);

    const saved = await Promise.all(
      req.files.map(async (file) => {
        const savedInfo = await storage.save(file.buffer, file.originalname, file.mimetype);
        return {
          fileId: savedInfo.fileId.toHexString(),
          filename: file.originalname,
          mimeType: file.mimetype,
          size: savedInfo.size || savedInfo.length || null,
        };
      })
    );

    res.jsend.success(saved);
    logger.debug("Finish uploadFilesController");
  } catch (error) {
    logger.error(error.message);
    res.status(400).jsend.fail(error.message);
  }
}
