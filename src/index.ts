import { setFailed, getInput } from "@actions/core";
import { getRelease } from "./utils";

async function run(): Promise<void> {
  try {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error("GITHUB_TOKEN not set");
    }
    let release: string = await getRelease(getInput("release"));
    console.log(`Release: ${release}`);

    
  } catch (error) {
    setFailed(error.message);
  }
}

run();
