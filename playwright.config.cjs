const path = require("node:path");

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000";

/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  testDir: path.join(__dirname, "devtools", "specs"),
  outputDir: path.join(__dirname, "devtools", "test-results"),
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL,
    headless: true,
    trace: "off",
    video: "off",
  },
};
