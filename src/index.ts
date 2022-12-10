import { getBooleanInput, getInput, info, setFailed } from "@actions/core";
import { VSCODE_ARCH } from "./env";
import { patch } from "./patch";
import {
  build,
  clone,
  copyRequiredFiles,
  getAllReleases,
  getLatestRelease,
  install,
  parseRelease
} from "./utils";

import("./env");

async function run(): Promise<void> {
  try {
    const release = await parseRelease(getInput("release"));
    const allReleases = await getAllReleases(
      "luxass",
      "vscode-schemas-releases"
    ).then((releases) => releases.map((release) => release.tag_name));
    info(`Release: ${release}`);

    if (allReleases.includes(release.tag_name)) {
      info(`Release ${release.tag_name} is already up to date`);
      return;
    }

    const repository = getInput("repository");
    const [owner, repo] = repository.split("/");
    await clone(owner, repo, release.tag_name);
    info(`Cloned ${repository} to vscode`);
    
    await install();
    info("Installed dependencies");

    await patch();
    info(`Patched vscode`);

    // await build(platform);
    // info("Building VSCode");
  } catch (error) {
    setFailed(error.message);
  }
}

run();
