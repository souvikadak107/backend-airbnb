const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
describe("Auth placeholder", () => {
  test("health route works (placeholder)", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
  });

  test("should register user", async () => {
    const res = await request(app)
      .post("/api/auth/singup")
      .send({
        name: "Test User",
        email: "test@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(201);
  });

});