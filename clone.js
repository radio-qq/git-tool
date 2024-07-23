const fs = require('fs')
const { exec } = require('child_process')
const { readJson } = require('./shared/json')
const { enquire } = require('./shared/enquire')
const { Log } = require('./shared/log')

const log = new Log()

main()

async function main() {
  const { configPath } = await enquire([
    ['configPath', 'repository config file path'],
  ])
  const configs = readJson(configPath)
  cloneRepositoryGroup(configs)
}

function cloneRepositoryGroup(configs) {
  if (Array.isArray(configs)) {
    configs.forEach(c => cloneRepositories(c))
    return
  }
  cloneRepositories(configs)
}

function cloneRepositories({ target, repositories }) {
  repositories.forEach(r => cloneRepository(target, r))
}

function cloneRepository(targetPath, repository) {
  const url = repository.http_url_to_repo || repository.ssh_url_to_repo

  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath)
  }

  const command = `git clone ${url}`

  exec(command, { cwd: targetPath }, error => {
    if (error) {
      log.error(`clone ${url}: ${error.message}`)
      return
    }
    log.success(`cloned ${url}`)
  })
}
