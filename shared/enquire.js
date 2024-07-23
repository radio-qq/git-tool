const readline = require('readline')

async function enquire(questions) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const record = {}

  for (const [key, description] of questions) {
    record[key] = await enquireOne(rl, `Please input ${description || key}: `)
  }

  rl.close()
  console.log('\n')

  return record
}

function enquireOne(rl, prompt) {
  return new Promise(resolve => {
    rl.question(prompt, answer => {
      resolve(String.raw`${answer}`)
    })
  })
}

exports.enquire = enquire
