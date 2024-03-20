const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { exec } = require("child_process");

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const execAsync = promisify(exec);

const TARGET_BRANCH = "master";

const REPOSITORIES_DIR = "./repo";

async function switchToTargetBranch(repositoryPath) {
  try {
    const { stdout: currentBranch } = await execAsync("git rev-parse --abbrev-ref HEAD", { cwd: repositoryPath });
    console.log(`Current branch in repository ${repositoryPath}: ${currentBranch}`);

    await execAsync(`git checkout ${TARGET_BRANCH}`, { cwd: repositoryPath });
    console.log(`Switched to branch ${TARGET_BRANCH} in repository ${repositoryPath}`);
  } catch (error) {
    console.error(`Failed to switch branch in repository ${repositoryPath}: ${error.message}`);
  }
}

async function main() {
  try {
    const entries = await readdir(REPOSITORIES_DIR);

    const repositories = [];
    for (const entry of entries) {
      const entryPath = path.join(REPOSITORIES_DIR, entry);
      const entryStat = await stat(entryPath);
      if (entryStat.isDirectory()) {
        const gitDirPath = path.join(entryPath, ".git");
        try {
          const gitDirStat = await stat(gitDirPath);
          if (gitDirStat.isDirectory()) {
            repositories.push(entryPath);
          }
        } catch (error) {}
      }
    }

    for (const repository of repositories) {
      await switchToTargetBranch(repository);
    }
  } catch (error) {
    console.error("Failed to switch branches in repositories:", error);
  }
}

main();
