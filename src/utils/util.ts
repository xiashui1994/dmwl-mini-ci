import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import simpleGit from 'simple-git'

/**
 * 字符串逗号分割转数组
 * @param value
 * @returns
 */
export const commaSeparatedList = (value: string) => value.split(',')

/**
 * 获取多个值中第一个不为空的值
 * @param {*} args
 * @returns
 */
export const getResult = (...args: any): any => args.find((item: any) => item)

/**
 * 获取文件
*/
export const getFile = (filePath: string): any => {
  const file = path.resolve(filePath)

  if (!fs.existsSync(file)) {
    return console.log(chalk.red(`文件 ${file} 不存在`))
  }

  return require(file)
}

/**
 * 替换JSON文件中的内容
*/
export const replaceJsonFile = (path: string, replace: { [key: string]: string }): void => {
  try {
    let file = fs.readFileSync(path, { encoding: 'utf-8' })
    for (const key in replace) {
      file = replaceJson(key, replace[key], file)
    }
    fs.writeFileSync(path, file, { "flag": "w" })
  } catch (err: any) {
    throw new Error(err)
  }
}

export const replaceJson = (path: string, value: number | string | boolean, file: string) => {
  const arr = path.split('.')
  const len = arr.length
  const lastItem = arr[len - 1]

  let i = 0
  let JsonArr = file.split(/\n/)

  for (let index = 0; index < JsonArr.length; index++) {
    const item = JsonArr[index]
    if (new RegExp(`"${arr[i]}"`).test(item)) ++i
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
 * @param {number} size
 * @returns
 */
export const formatSize = (size: number) => {
  const unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let i = 0
  while (size >= 1024) {
    size /= 1024
    i++
  }
  return `${size.toFixed(2)}${unit[i]}`
}
