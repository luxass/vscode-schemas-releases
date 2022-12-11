if (!process.env.GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN not set");
}

export const GITHUB_TOKEN = process.env.GITHUB_TOKEN as string;
export const VSCODE_ARCH = process.env.VSCODE_ARCH as "x64" | "arm64" | "ia32";
export const RUNNER_OS = process.env.RUNNER_OS as "macOS" | "Linux" | "Windows";
