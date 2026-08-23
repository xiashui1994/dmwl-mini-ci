import type { Options } from '../type'
import fs from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'

let cacheConfig: Options

export async function getConfig(config: string): Promise<Options | undefined> {
  if (cacheConfig) {
    return cacheConfig
  }

  let configFilePath = 'dmwlci.config.mjs'

  if (config && typeof config === 'string') {
    configFilePath = config
  }

  const configFile = path.resolve(configFilePath)

  if (!fs.existsSync(configFile)) {
    console.warn(chalk.red(`文件 ${configFile} 不存在，请创建配置文件或指定配置文件路径`))
    return
  }

  const configData = (await import(configFile)).default as Options
  cacheConfig = configData

  return configData
}
