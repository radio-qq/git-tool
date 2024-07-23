const { exec } = require('child_process')
const { enquire } = require('./shared/enquire')
const { getPaths } = require('./shared/path')
const { Log } = require('./shared/log')

const log = new Log()

main()

async function main() {
  const { dirPath, branch } = await enquire([
    ['dirPath', 'repository dir path'],
    ['branch', 'target branch which want to checkout'],
  ])
  checkoutBranch(dirPath, branch)
}

function checkoutBranch(dirPath, branch) {
  const paths = getPaths(dirPath)
  paths.forEach(p => execCheck(p, branch))
}

function execCheck(path, branch) {
  exec(`git checkout -b ${branch} origin/${branch}`, { cwd: path }, error => {
    if (error) {
      if (error.message.includes('already exists')) {
        exec(`git checkout ${branch} && git pull`, { cwd: path }, err => {
          if (err) {
            log.error(`checkout, unrecognized errors`)
          } else {
            log.success(`checkout ${path} to branch ${branch}`)
          }
        })
      } else {
        console.error(`${path}远程没有该分支${branch}`)
      }
      return
    }
    log.success(`checkout ${path} to branch ${branch}`)
  })
}
