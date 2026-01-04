import { upload } from "./resource-upload.middleware.js";
import FileStorageService from "../../infrastructure_layer/storage/file-storage.service.js";
import { config } from "../../config.js";

const fileStorage = new FileStorageService(config.upload.uploadDir);

export function coverUploadMiddleware(req, res, next) {
  const uploadHandler = upload.single("avatar");
  uploadHandler(req, res, async function (err) {
    if (err) {
      return res.status(400).jsend.fail(err.message);
    }

    if (req.file) {
      try {
        const fileData = await fileStorage.saveFile(req.file, "covers");
        // attach URL to body so downstream usecases receive it
        req.body.coverImage = fileData.fileUrl;
      } catch (e) {
        return res.status(500).jsend.fail(e.message);
      }
    }

    next();
  });
}
