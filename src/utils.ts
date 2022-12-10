import { setFailed } from "@actions/core";
import { exec } from "@actions/exec";
import { getOctokit } from "@actions/github";
import { GITHUB_TOKEN } from "./env";
import { octokit } from "./octokit";

export async function getRelease(tagName: string) {
  const { data: release } = await octokit.rest.repos.getReleaseByTag({
    owner: "microsoft",
    repo: "vscode",
    tag: tagName
  });
  return release;
}

export async function parseRelease(release: string) {
  return release.length > 0
    ? await getRelease(release)
    : await getLatestRelease("microsoft", "vscode");
}

export async function getLatestRelease(owner: string, repo: string) {
  return (
    await getOctokit(GITHUB_TOKEN).rest.repos.getLatestRelease({
      owner,
      repo
    })
  ).data;
}

export async function getAllReleases(owner: string, repo: string) {
  return (
    await octokit.paginate("GET /repos/{owner}/{repo}/releases", {
      owner,
      repo,
      per_page: 100
    })
  )
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
