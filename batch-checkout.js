const fs = require("fs");
const path = require("path");
const readline = require("readline");

const { exec } = require("child_process");

// 我怕覆盖，而我的json又git ignore，所以之后我应该在这里加上时间戳 防覆盖
// const REPOSITORIES_CONFIG_JSON = "./json/performance-backend";

main();

async function main() {
  const { configPath, branch } = await askForNewRecord();
  console.log(configPath, branch);
  checkoutToBranch(branch, configPath);
}

async function askForNewRecord() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const newRecord = {};

  newRecord.configPath =
    (await askQuestion(rl, "Please repo config json: ")) ||
    String.raw`E:\baiya-backend\core`;

  newRecord.branch =
    (await askQuestion(rl, "Please enter branch: ")) || "fix-10017";
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

function checkoutToBranch(branch, configPath) {
  const fileNames = fs.readdirSync(configPath);
  const filePaths = fileNames.map((name) => path.join(configPath, name));
  filePaths.forEach((path) => execCheck(branch, path));
}

function execCheck(branch, path) {
  exec(`git checkout -b ${branch} origin/${branch}`, { cwd: path }, (error) => {
    if (error) {
      if (error.message.includes("already exists")) {
        exec(`git checkout ${branch} && git pull`, { cwd: path }, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`${path} Successfully checkout ${branch}`);
          }
        });
      } else {
        console.log(`${path}远程没有该分支${branch}`);
      }
      return;
    }
    console.log(`Successfully checkout ${path}`);
  });
}
