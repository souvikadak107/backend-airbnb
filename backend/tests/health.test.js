const request = require("supertest");
const app = require("../app");

describe("Health Check", () => {
  it("GET /api/health should return OK", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "OK" });
  });
});
