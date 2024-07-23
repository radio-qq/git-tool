const path = require('path')
const fs = require('fs')

function getPaths(dirPath) {
  const filePaths = fs.readdirSync(dirPath)
  return filePaths.map(p => path.join(dirPath, p))
}

exports.getPaths = getPaths
