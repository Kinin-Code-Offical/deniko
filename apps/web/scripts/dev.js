/* eslint-disable @typescript-eslint/no-require-imports */
const { spawn } = require("child_process");

const useWebpack = process.env.DEV_BUNDLER === "webpack";
const args = ["dev"];
if (useWebpack) {
  console.log("Starting Next.js with Webpack...");
  args.push("--webpack");
} else {
  console.log("Starting Next.js with Turbopack...");
}

const child = spawn("next", args, {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("exit", (code) => {
  process.exit(code);
});
