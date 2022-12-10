if (!process.env.GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN not set");
}

if (!process.env.VSCODE_ARCH) {
  throw new Error("VSCODE_ARCH not set");
}

export const GITHUB_TOKEN = process.env.GITHUB_TOKEN as string;
export const VSCODE_ARCH = process.env.VSCODE_ARCH as string;
