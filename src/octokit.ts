import { getOctokit } from "@actions/github";
import { GITHUB_TOKEN } from "./env";

export const octokit = getOctokit(GITHUB_TOKEN);
