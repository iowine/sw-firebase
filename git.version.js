const { writeFileSync } = require('fs')

const versionInfoJson = JSON.stringify({ raw: process.env.COMMIT }, null, 2)
writeFileSync(`${__dirname}/git.version.json`, versionInfoJson)

console.log(`Using commit ${versionInfoJson.raw}`)  
