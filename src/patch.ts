import { readdir } from "node:fs/promises";

export async function patch() {
  const patches = await readdir("./code-patches");
  for (const patch of patches) {
    console.log(patch);
  }
  
}