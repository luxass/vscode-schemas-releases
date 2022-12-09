import { setFailed, getInput, info } from "@actions/core";
import { patch } from "./patch";
import { build, clone, copyRequiredFiles, getRelease, install } from "./utils";

async function run(): Promise<void> {
  try {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error("GITHUB_TOKEN not set");
    }

    const release: string = await getRelease(getInput("release"));
    info(`Release: ${release}`);

    const platform: string = getInput("platform");
    info(`Platform: ${platform}`);

    const repository = getInput("repository");
    const [owner, repo] = repository.split("/");

    await clone(owner, repo, release);
    info(`Cloned ${repository} to vscode`);

    await install();
    info("Installed dependencies");

    await patch();
    info(`Patched vscode`);

    await build(platform);
    info("Building VSCode");

  } catch (error) {
    setFailed(error.message);
  }
}

run();
