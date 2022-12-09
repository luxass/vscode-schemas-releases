import { setFailed, getInput, info } from "@actions/core";
import { exec } from "@actions/exec";
import { patch } from "./patch";
import { build, clone, getRelease, install } from "./utils";

async function run(): Promise<void> {
  try {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error("GITHUB_TOKEN not set");
    }
    const release: string = await getRelease(getInput("release"));
    info(`Release: ${release}`);

    const repository = getInput("repository");
    const [owner, repo] = repository.split("/");

    await clone(owner, repo, release);
    info(`Cloned ${repository} to vscode`);

    await exec("ls");
    await exec("ls", ["../vscode"]);
    await exec("cat", ["../vscode/package.json"])
    await install();
    info("Installed dependencies");

    await patch();
    info(`Patched vscode`);
    
    await build();
    info("Building VSCode");
  } catch (error) {
    setFailed(error.message);
  }
}

run();
