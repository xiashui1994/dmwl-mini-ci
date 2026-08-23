import type { Options } from './type'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import chalk from 'chalk'
import fse from 'fs-extra'
import Ci from './ci'
import { getOptions } from './utils/getOptions'
import { printResult } from './utils/printResult'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * 初始化配置文件
 */
export function init(cmd: any) {
  let outputPath = 'dmwlci.config.mjs'
  const { output } = cmd
  if (output && typeof output === 'string') {
    outputPath = output
    if (!outputPath.endsWith('.mjs')) {
      outputPath += '.mjs'
    }
  }
  const targetFile = path.resolve(outputPath)
  if (fs.existsSync(targetFile)) {
    console.warn(chalk.red(`文件 ${targetFile} 已经创建`))
    return
  }
  fse.copySync(path.join(__dirname, 'libs/dmwlci.config.mjs'), targetFile)
  console.warn(chalk.green(`文件 ${targetFile} 创建成功`))
}

export async function preview(cmd: any) {
  const options = await getOptions(cmd)

  if (!options.length) {
    return
  }

  for (let i = 0; i < options.length; i++) {
    const option: Options = options[i]
    const result = await new Ci(option).preview()
    if (result) {
      options[i].result = result
    }
  }

  const printInfo = options.map((option) => {
    const { appid, preview, result } = option
    return {
      appid,
      version: preview.version,
      desc: preview.desc,
      robot: preview.robot,
      result,
    }
  })

  return printResult(printInfo)
}

export async function upload(cmd: any) {
  const options = await getOptions(cmd)

  if (!options.length) {
    return
  }

  for (let i = 0; i < options.length; i++) {
    const option: Options = options[i]
    const result = await new Ci(option).upload()
    if (result) {
      options[i].result = result
    }
  }

  const printInfo = options.map((option) => {
    const { appid, upload, result } = option
    return {
      appid,
      version: upload.version,
      desc: upload.desc,
      robot: upload.robot,
      result,
    }
  })

  return printResult(printInfo)
}
