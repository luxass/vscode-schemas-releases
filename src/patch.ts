import { readdir } from "node:fs/promises";

export async function patch() {
  const patches = await readdir("./code-patches").then((files) =>
    files.filter((file) => file.endsWith(".patch"))
  );
  
  for (const patch of patches) {
    console.log(`Patching ${patch}...`);
  }
}
