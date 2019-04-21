const { writeFileSync } = require('fs')

const versionInfoJson = JSON.stringify({ raw: process.env.SHORT_SHA }, null, 2)
writeFileSync(`${__dirname}/git.version.json`, versionInfoJson)

console.log(`Using commit ${versionInfoJson.raw}`)  
