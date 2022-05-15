import path from 'path'
import fs from 'fs'
import fse from 'fs-extra'
import chalk from 'chalk'
import Ci from './ci'
import { getOptions } from './utils/getOptions'
import { printResult } from './utils/printResult'
import { Options } from './type'

/**
 * 初始化配置文件
 * @param cmd
 * @returns
 */
export const init = (cmd: any) => {
  let outputPath = 'dmwlci.config.js'
  const { output } = cmd
  if (output && typeof output === 'string') {
    outputPath = output
    !outputPath.endsWith('.js') && (outputPath += '.js')
  }
  const targetFile = path.resolve(outputPath)
  if (fs.existsSync(targetFile)) {
    return console.log(chalk.red(`文件 ${targetFile} 已经创建`))
  }
  fse.copySync(path.join(__dirname, '../libs/dmwlci.config.js'), targetFile)
  console.log(chalk.green(`文件 ${targetFile} 创建成功`))
}

export const preview = async (cmd: any) => {
  // 合并配置
  const options = await getOptions(cmd)

  if (!options.length) { return }

  // 遍历配置，执行CI
  for (let i = 0; i < options.length; i++) {
    const option: Options = options[i]
    const result = await new Ci(option).preview()
    result && (options[i].result = result)
  }

  const printInfo = options.map(option => {
    const { appid, preview, result } = option
    return {
      appid,
      version: preview.version,
      desc: preview.desc,
      robot: preview.robot,
      result
    }
  })

  return printResult(printInfo)
}

export const upload = async (cmd: any) => {
  // 合并配置
  const options = await getOptions(cmd)

  if (!options.length) { return }

  // 遍历配置，执行CI
  for (let i = 0; i < options.length; i++) {
    const option: Options = options[i]
    const result = await new Ci(option).upload()
    result && (options[i].result = result)
  }

  const printInfo = options.map(option => {
    const { appid, upload, result } = option
    return {
      appid,
      version: upload.version,
      desc: upload.desc,
      robot: upload.robot,
      result
    }
  })

  return printResult(printInfo)
}
