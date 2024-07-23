const fs = require('fs')
const { getPaths } = require('./path')
const { Log } = require('./log')

const log = new Log()

function readJson(path) {
  const stat = fs.lstatSync(path)
  if (stat.isDirectory()) {
    return readJsonDir(path)
  }

  return readJsonFile(path)
}

function readJsonDir(dirPath) {
  const filePaths = getPaths(dirPath)
  return filePaths.map(readJsonFile)
}

function readJsonFile(filePath, { catchError } = {}) {
  let result = {}
  try {
    result = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }))
    log.success(`read json file ${filePath}`)
  } catch (error) {
    log.error(`read json file ${error}`)

    if (!catchError) {
      throw new Error()
    }
  }
  return result
}

exports.readJson = readJson
