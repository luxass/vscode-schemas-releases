import { getOctokit } from "@actions/github";
import { GITHUB_TOKEN } from "./env";

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
