import { setFailed, getInput } from "@actions/core";
import { clone, getRelease } from "./utils";

async function run(): Promise<void> {
  try {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error("GITHUB_TOKEN not set");
    }
    const release: string = await getRelease(getInput("release"));
    console.log(`Release: ${release}`);

    const repository = getInput("repository");
    const [owner, repo] = repository.split("/");

    await clone(owner, repo);
    console.log(`Cloned ${repository} to vscode`);

    
    
  } catch (error) {
    setFailed(error.message);
  }
}

run();
