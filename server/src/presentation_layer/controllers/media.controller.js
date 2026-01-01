import FileStorageService from "../../infrastructure_layer/storage/file-storage.service.js";
import { config } from "../../config.js";
import { upload } from "../middlewares/resource-upload.middleware.js";

const fileStorage = new FileStorageService(config.upload.uploadDir);

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
      const saved = await fileStorage.saveFile(req.file, "covers");
      return res.jsend.success({ fileUrl: saved.fileUrl });
    } catch (e) {
      return res.status(500).jsend.fail(e.message);
    }
  });
}
