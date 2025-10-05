import signUpRouter from "../signUpRouter";
import request from "supertest";
import express from "express";
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/", signUpRouter);

it("should add new users to DB", done => {
    request(app)
        .post("/api/sign-up")
        .type("form")
        .send({ username: "test", email: "test", password: "password" })
        .expect(201, done);
});
