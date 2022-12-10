import { setFailed } from "@actions/core";
import { exec } from "@actions/exec";
import { getOctokit } from "@actions/github";
import { GITHUB_TOKEN, RUNNER_OS, VSCODE_ARCH } from "./env";
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
  return await octokit.paginate("GET /repos/{owner}/{repo}/releases", {
    owner,
    repo,
    per_page: 100
  });
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

export async function prepareBuild(): Promise<void> {
  await exec("yarn", ["--cwd", "../vscode", "run", "monaco-compile-check"]);
  await exec("yarn", ["--cwd", "../vscode", "run", "valid-layers-check"]);
  await exec("yarn", ["--cwd", "../vscode", "gulp", "compile-build"]);
  await exec("yarn", ["--cwd", "../vscode", "gulp", "compile-extension-media"]);
  await exec("yarn", [
    "--cwd",
    "../vscode",
    "gulp",
    "compile-extensions-build"
  ]);
  await exec("yarn", ["--cwd", "../vscode", "gulp", "minify-vscode"]);
}

export async function build(): Promise<void> {
  await prepareBuild();
  let script: string;
  let reh: boolean = true;
  if (RUNNER_OS === "macOS") {
    script = `darwin-${VSCODE_ARCH}-min-ci`;
  } else if (RUNNER_OS === "Windows") {
    script = `win32-${VSCODE_ARCH}-min-ci`;
    if (VSCODE_ARCH === "arm64") {
      reh = false;
    }
  } else {
    script = `linux-${VSCODE_ARCH}-min-ci`;
  }

  await exec("yarn", ["--cwd", "../vscode", "gulp", `vscode-${script}`]);
  
  if (reh) {
    await exec("yarn", ["--cwd", "../vscode", "gulp", "minify-vscode-reh"]);
    await exec("yarn", ["--cwd", "../vscode", "gulp", `vscode-reh-${script}`]);
  }

}

export async function copyRequiredFiles() {}
