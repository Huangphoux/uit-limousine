import {
  batchUploadLessonResourcesUsecase,
  streamLessonResourceUsecase,
  uploadLessonResourceUsecase,
} from "../../composition-root.js";
import { logger } from "../../utils/logger.js";

export async function uploadResourceController(req, res) {
  try {
    const usecase = uploadLessonResourceUsecase;
    logger.debug(`Calling ${usecase.constructor.name}`);

    let input = {
      id: req.body.id,
      lessonId: req.params.lessonId,
      filename: req.file.originalname,
      mimeType: req.file.mimetype,
      stream: req.file.buffer,
    };

    const result = await usecase.execute(input);
    res.jsend.success(result);

    logger.debug(`Finish ${usecase.constructor.name}`);
  } catch (error) {
    res.status(400).jsend.fail(error.message);
    logger.error(error.message);
  }
}

export async function uploadResourcesController(req, res) {
  try {
    const usecase = batchUploadLessonResourcesUsecase;
    logger.debug(`Calling ${usecase.constructor.name}`);

    if (!req.files) throw Error(`Resources lost`);

    let input = req.files.map((file) => ({
      lessonId: req.params.lessonId,
      filename: file.originalname,
      mimeType: file.mimetype,
      stream: file.buffer,
    }));

    const result = await usecase.execute(input);
    res.jsend.success(result);

    logger.debug(`Finish ${usecase.constructor.name}`);
  } catch (error) {
    res.status(400).jsend.fail(error.message);
    logger.error(error.message);
  }
}

export async function streamResourceController(req, res) {
  try {
    const usecase = streamLessonResourceUsecase;
    logger.debug(`Calling ${usecase.constructor.name}`);

    let input = {
      lessonId: req.params.lessonId,
      resourceId: req.params.resourceId,
    };

    const result = await usecase.execute(input);

    console.log(result);

    res.setHeader("Content-Disposition", `attachment; filename="${result.filename}"`);
    res.setHeader("Content-Type", `${result.mimeType}`);

    result.stream.pipe(res);

    result.stream.on("end", () => {
      logger.debug(`Finish ${usecase.constructor.name}`);
    });

    result.stream.on("error", (err) => {
      logger.error(`Stream error: ${err.message}`);
      if (!res.headersSent) {
        res.status(500).jsend.error("File not found or failed to stream");
      } else {
        res.end();
      }
    });
  } catch (error) {
    logger.error(`Controller error: ${error.message}`);
    if (!res.headersSent) {
      if (error.message.includes("File not found") || error.message.includes("FileNotFound")) {
        res.status(404).jsend.fail("File not found in storage. It may have been deleted.");
      } else if (error.message.includes("Invalid resource id")) {
        res.status(404).jsend.fail("Resource not found");
      } else {
        res.status(400).jsend.fail(error.message);
      }
    }
  }
}
