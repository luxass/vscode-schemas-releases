import { getOctokit } from "@actions/github";
import { GITHUB_TOKEN } from "./env";
import { exec } from "@actions/exec";

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

export async function build(): Promise<void> {
  await exec("cd", ["../vscode"])
  await exec("yarn", ["run", "compile"]);
}
