import core from "@actions/core";

async function run(): Promise<void> {
  try {
    const release: string = core.getInput("release");
    console.log(`Release: ${release}`);
    
  } catch (error) {
    console.log(error);
    
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
