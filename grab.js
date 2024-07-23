const { exec } = require('child_process')
const { readJson } = require('./shared/json')
const { enquire } = require('./shared/enquire')
const { Log } = require('./shared/log')

const log = new Log()

main()

async function main() {
  const defaultOutput = 'repositories_' + new Date().valueOf() + '.json'

  const keys = [
    'name',
    'description',
    'http_url_to_repo',
    'ssh_url_to_repo',
  ].join(',')

  const { token, site } = readJson('privacy.json')
  const { groupId, output } = await enquire([
    ['groupId'],
    ['output', 'output file path(optional)'],
  ])

  const command = `curl --header "PRIVATE-TOKEN:${token}" "${site}/api/v4/groups/${groupId}/projects?per_page=100&page=1"  | jq "map({${keys}})" > ${
    output || defaultOutput
  }`

  exec(command, error => {
    if (error) {
      log.error(error)
      return
    }
    log.success('grab')
  })
}
