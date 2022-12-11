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
    await octokit.rest.repos.getLatestRelease({
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
