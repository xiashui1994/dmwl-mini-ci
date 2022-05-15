import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import { Options } from '../type'

let cacheConfig: Options

export const getConfig = (config: string): void | Options => {
  if (cacheConfig) {
    return cacheConfig
  }

  let configFilePath = 'dmwlci.config.js'

  if (config && typeof config === 'string') {
    configFilePath = config
  }

  const configFile = path.resolve(configFilePath)

  if (!fs.existsSync(configFile)) {
    return console.log(chalk.red(`文件 ${configFile} 不存在，请创建配置文件或指定配置文件路径`))
  }

  const configData = require(configFile) as Options
  cacheConfig = configData

  return configData
}
