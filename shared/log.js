class Log {
  constructor() {}

  info(message) {
    console.log(`${message}`)
  }

  success(message) {
    console.log(`Successfully ${message.toString()}\n`)
  }

  error(message) {
    console.error(`Failed ${message.toString()}\n`)
  }
}

exports.Log = Log
