import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const mode = process.argv[2] === "production" ? "production" : "development";
process.env.TENZU_BUILD_MODE = mode;

const dist = path.join(process.cwd(), "dist");
if (fs.existsSync(dist)) {
  try {
    fs.rmSync(dist, { recursive: true, force: true });
  } catch {
    console.warn("WARN: could not fully clear dist before build");
  }
}

const child = spawn("npx", ["astro", "build"], {
  stdio: ["inherit", "pipe", "pipe"],
  shell: true,
  env: process.env,
});

let combined = "";
child.stdout.on("data", (chunk) => {
  process.stdout.write(chunk);
  combined += chunk.toString();
});
child.stderr.on("data", (chunk) => {
  process.stderr.write(chunk);
  combined += chunk.toString();
});

child.on("close", (code) => {
  const index = path.join("dist", "index.html");
  const dropboxLock = /EBUSY: resource busy or locked, rmdir/.test(combined);
  if (code === 0) process.exit(0);
  if (dropboxLock && fs.existsSync(index)) {
    console.log("WARN: empty-dir cleanup locked by another process; pages exist, treating as success.");
    process.exit(0);
  }
  process.exit(code ?? 1);
});
