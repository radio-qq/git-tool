const fs = require("fs");
const path = require("path");
const readline = require("readline");

const { exec } = require("child_process");

// 我怕覆盖，而我的json又git ignore，所以之后我应该在这里加上时间戳 防覆盖
// const REPOSITORIES_CONFIG_JSON = "./json/performance-backend";

main();

async function main() {
  const { configPath } = await askForNewRecord();

  const stat = fs.lstatSync(configPath);
  if (stat.isDirectory()) {
    readJSONDir(configPath);
    return;
  }
  readJSONFile(configPath);
}

async function askForNewRecord() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const newRecord = {};

  newRecord.configPath = await askQuestion(rl, "Please repo config json: ");

  rl.close();

  return newRecord;
}

function askQuestion(rl, prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(String.raw`${answer}`);
    });
  });
}

function readJSONFile(filePath) {
  const { target_path, repositories } = readRepositoryConfig(filePath);
  repositories.forEach((repo) => cloneRepository(repo, target_path));
}

function readJSONDir(dirPath) {
  const fileNames = fs.readdirSync(dirPath);
  const filePaths = fileNames.map((name) => path.join(dirPath, name));
  filePaths.forEach(readJSONFile);
}

function readRepositoryConfig(filePath) {
  let result = {};
  try {
    result = JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));
    console.log(`Successfully read JSON file ${filePath}`);
  } catch (error) {
    console.log(error.toString());
  }
  return result;
}

function cloneRepository(repo, target_path) {
  // 这是之前的旧仓库地址
  // const repoUrl = repo.http_url_to_repo;
  // 现在要用新的
  const repoUrl = repo.http_url_to_repo || repo.ssh_url_to_repo;
  if (!fs.existsSync(target_path)) {
    fs.mkdirSync(target_path);
  }

  exec(`git clone ${repoUrl}`, { cwd: target_path }, (error) => {
    if (error) {
      console.log(`Failed to clone ${repoUrl}: ${error.message}`);
      return;
    }
    console.log(`Successfully cloned ${repoUrl}`);
  });
}
