const { gitDescribeSync } = require('git-describe')
const { writeFileSync } = require('fs')

console.log('Getting git commit hash...')

try {
  
  const gitInfo = gitDescribeSync()
  
  const versionInfoJson = JSON.stringify(gitInfo, null, 2)

  writeFileSync('git.version.json', versionInfoJson)
  
  console.log(`Using local commit ${gitInfo.raw}`)
  
} catch (e) {
  
  const gitInfo = {
    raw: process.env.commit
  }
  
  const versionInfoJson = JSON.stringify(gitInfo, null, 2)

  writeFileSync('git.version.json', versionInfoJson)
  
  console.log(`Using Cloud Build commit ${gitInfo.raw}`)
  
}
