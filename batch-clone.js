const fs = require("fs");
const { exec } = require("child_process");

function readRepositoryConfig(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (error, data) => {
      if (error) {
        reject({
          isSuccess: false,
          message: `Failed read JSON file ${filePath}: ${error.message}`,
        });
        return;
      }
      resolve({
        isSuccess: true,
        message: `Successfully read JSON file ${filePath}`,
        data: JSON.parse(data),
      });
    });
  });
}

function cloneRepository(repo) {
  return new Promise((resolve, reject) => {
    const repoUrl = repo.http_url_to_repo;
    exec(`git clone ${repoUrl}`, { cwd: REPOSITORIES_SAVE_PATH }, (error) => {
      if (error) {
        reject({
          isSuccess: false,
          message: `Failed to clone ${repoUrl}: ${error.message}`,
        });
        return;
      }
      resolve({ isSuccess: true, message: `Successfully cloned ${repoUrl}` });
    });
  });
}

function printResult(result) {
  result.isSuccess
    ? console.log(result.message)
    : console.error(result.message);
}

async function main(configPath) {
  try {
    const { data: repositories } = await readRepositoryConfig(configPath);
    const clonePromises = repositories.map(cloneRepository);
    const results = await Promise.all(clonePromises);
    results.forEach(printResult);
  } catch (error) {
    console.error(error);
  }
}

const REPOSITORIES_CONFIG_JSON = "./repositories.json";

const REPOSITORIES_SAVE_PATH = "./repo";

main(REPOSITORIES_CONFIG_JSON);
