import { getOctokit } from "@actions/github";
import { GITHUB_TOKEN } from "./env";
import { exec } from "@actions/exec";
import { setFailed } from "@actions/core";

export async function getRelease(release: string): Promise<string> {
  if (release.length > 0) {
    return release;
  }
  return (
    await getOctokit(GITHUB_TOKEN).rest.repos.getLatestRelease({
      owner: "microsoft",
      repo: "vscode"
    })
  ).data.tag_name;
}

export async function clone(
  owner: string,
  repo: string,
  release: string
): Promise<void> {
  await exec("git", [
    "clone",
    "--depth",
    "1",
    "--branch",
    release,
    `https://github.com/${owner}/${repo}.git`,
    "../vscode"
  ]);
}

export async function install(): Promise<void> {
  await exec("yarn", ["install", "--cwd", "../vscode"]);
}

export async function build(platform: string): Promise<void> {
  if (platform === "windows") {
    platform = "win32-x64";
  } else if (platform === "linux") {
    platform = "linux-x64";
  } else if (platform === "darwin") {
    platform = "darwin-x64";
  } else {
    setFailed(`Invalid platform: ${platform}`);
  }

  await exec("yarn", ["--cwd", "../vscode", "gulp", `vscode-${platform}`]);
}

export async function copyRequiredFiles() {}
