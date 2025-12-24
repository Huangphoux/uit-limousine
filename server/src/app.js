import express from "express";
import cors from "cors";
import path from "path";
import jsend from "jsend";
import authRouter from "./presentation_layer/routes/auth.route.js";
import coursesRouter from "./presentation_layer/routes/courses.route.js";
import lessonRouter from "./presentation_layer/routes/lessons.router.js";
import notificationRouter from "./presentation_layer/routes/notification.route.js";
import gradeRouter from "./presentation_layer/routes/grade.route.js";
import instructorRouter from "./presentation_layer/routes/instructor.route.js";
import adminRouter from "./presentation_layer/routes/admin.route.js";
import { config } from "./config.js";

const app = express();
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? ["https://uit-limousine.netlify.app"] : true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(jsend.middleware);

app.use("/uploads", express.static(path.resolve(config.upload.uploadDir)));

app.use("/auth", authRouter);
app.use("/courses", coursesRouter);
app.use("/lessons", lessonRouter);
app.use("/notifications", notificationRouter);
app.use("/grade", gradeRouter);
app.use("/instructor", instructorRouter);
app.use("/admin", adminRouter);

app.get("/", (req, res) => {
  res.jsend.success({ message: "UIT Limousine API is running!" });
});

app.use((req, res) => {
  res.status(404).jsend.error({
    message: `Route ${req.originalUrl} not found`,
    statusCode: 404,
  });
});

export default app;
