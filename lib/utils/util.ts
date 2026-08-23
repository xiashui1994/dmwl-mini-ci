import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import chalk from 'chalk'
import simpleGit from 'simple-git'

/**
 * 字符串逗号分割转数组
 */
export function commaSeparatedList(value: string) {
  return value.split(',')
}

/**
 * 获取多个值中第一个不为空的值
 */
export function getResult(...args: any): any {
  return args.find((item: any) => item)
}

/**
 * 获取文件
 */
export async function getFile(filePath: string): Promise<any> {
  const file = path.resolve(filePath)

  if (!fs.existsSync(file)) {
    console.warn(chalk.red(`文件 ${file} 不存在`))
    return
  }

  if (file.endsWith('.json')) {
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  }

  return (await import(file)).default
}

/**
 * 替换JSON文件中的内容
 */
export function replaceJsonFile(filePath: string, replace: { [key: string]: string }): void {
  try {
    let file = fs.readFileSync(filePath, { encoding: 'utf-8' })
    for (const key in replace) {
      file = replaceJson(key, replace[key], file)
    }
    fs.writeFileSync(filePath, file, { flag: 'w' })
  }
  catch (err: any) {
    throw new Error(err)
  }
}

export function replaceJson(jsonPath: string, value: number | string | boolean, file: string) {
  const arr = jsonPath.split('.')
  const len = arr.length
  const lastItem = arr[len - 1]

  let i = 0
  const JsonArr = file.split(/\n/)

  for (let index = 0; index < JsonArr.length; index++) {
    const item = JsonArr[index]
    if (new RegExp(`"${arr[i]}"`).test(item))
      ++i
    if (i === len) {
      const hasComma = /,/.test(item)
      JsonArr[index] = item.replace(new RegExp(`"${lastItem}"[\\s\\S]*:[\\s\\S]*`), `"${lastItem}": ${value}${hasComma ? ',' : ''}`)
      break
    }
  }

  return JsonArr.join('\n')
}

/**
 * git
 */
export const git = (() => simpleGit(process.cwd()))()

/**
 * 格式化size
 */
export function formatSize(size: number) {
  const unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let i = 0
  while (size >= 1024) {
    size /= 1024
    i++
  }
  return `${size.toFixed(2)}${unit[i]}`
}
