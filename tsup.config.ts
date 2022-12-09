import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["src/index.ts"],
  outDir: "dist",
  format: "cjs",
  clean: true,
  target: "node16",
  bundle: true,
  treeshake: true,
  noExternal: ["@actions/core"]
});
