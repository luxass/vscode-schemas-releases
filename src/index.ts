import { create as createArtifactClient } from "@actions/artifact";
import { getInput, info, setFailed } from "@actions/core";
import { patch } from "./patch";
import { build, clone, getAllReleases, install, parseRelease } from "./utils";
import { create as createGlob } from "@actions/glob";
import("./env");

const artifactClient = createArtifactClient();

async function run(): Promise<void> {
  try {
    const type = getInput("type") as "build" | "copy-src";
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

    if (type === "copy-src") {
      const globber = await createGlob(
        ["vscode/src/**/*.ts", "vscode/extensions/**/*.ts"].join("\n")
      );
      const files = await globber.glob();
      await artifactClient.uploadArtifact("vscode-src", files, ".");
      info("Uploaded artifact");
    } else {
      await install();
      info("Installed dependencies");

      await patch();
      info(`Patched vscode`);

      const files = await build();
      info("Building VSCode");
    }
  } catch (error) {
    setFailed(error.message);
  }
}

run();
