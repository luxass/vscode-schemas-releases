import { setFailed, getInput } from "@actions/core";

async function run(): Promise<void> {
  try {
    const release: string = getInput("release", {
      
    });
    console.log(`Release: ${release}`);
  } catch (error) {
    setFailed(error.message);
  }
}

run();
