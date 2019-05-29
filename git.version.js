const { writeFileSync } = require('fs')

const commit = process.env.SHORT_SHA || 'N/A'
console.log(`Using commit ${commit}`)  

const info = JSON.stringify({ raw: commit }, null, 2)
writeFileSync(`${__dirname}/git.version.json`, info)
