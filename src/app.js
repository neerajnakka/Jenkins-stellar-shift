const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    application: "devops-nodejs-cicd-lab",
    message: "Application is running",
    version: process.env.APP_VERSION || "local"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "nodejs-app"
  });
});

app.get("/ready", (req, res) => {
  res.status(200).json({
    status: "READY"
  });
});

app.get("/api/version", (req, res) => {
  res.json({
    version: process.env.APP_VERSION || "1.0.0",
    environment: process.env.NODE_ENV || "development"
  });
});

module.exports = app;
