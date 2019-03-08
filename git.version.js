const { gitDescribeSync } = require('git-describe')
const { writeFileSync } = require('fs')

try {
  
  const gitInfo = gitDescribeSync()
  
  const versionInfoJson = JSON.stringify(gitInfo, null, 2)

  writeFileSync('git.version.json', versionInfoJson)
  
} catch (e) {
  
  const gitInfo = {
    raw: process.env.commit
  }
  
  const versionInfoJson = JSON.stringify(gitInfo, null, 2)
  
  writeFileSync('git.version.json', versionInfoJson)
  
}
