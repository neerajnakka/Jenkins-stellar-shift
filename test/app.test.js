const request = require("supertest");
const app = require("../src/app");

describe("Application", () => {
  test("GET / returns application information", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.body.application).toBe("devops-nodejs-cicd-lab");
  });

  test("GET /health returns UP", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("UP");
  });

  test("GET /ready returns READY", async () => {
    const response = await request(app).get("/ready");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("READY");
  });
});
test("GET /api/info returns application information", async () => {
  const response = await request(app).get("/api/info");

  expect(response.statusCode).toBe(200);
  expect(response.body.service).toBe("nodejs-app");
});