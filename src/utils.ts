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

export async function clone(owner: string, repo: string): Promise<void> {
  await exec("git", ["clone", `https://github.com/${owner}/${repo}.git`]);
}
