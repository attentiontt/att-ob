import path from "path"
import { fileURLToPath } from "url"
import { Mutex } from "async-mutex"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

console.log("Starting custom Quartz build...")

// Import build.ts using tsx loader
const { default: buildQuartz } = await import("./quartz/build.ts")

const argv = {
  directory: "./content",
  output: "./public",
  baseDir: "",
  verbose: false,
  watch: false,
  serve: false,
  port: 8080,
  wsPort: 3001,
  bundleInfo: false,
  concurrency: 1,
}

const buildMutex = new Mutex()
let clientRefresh = () => {}

try {
  await buildQuartz(argv, buildMutex, clientRefresh)
  console.log("Build completed successfully!")
} catch (err) {
  console.error("Build failed:", err)
  process.exit(1)
}
