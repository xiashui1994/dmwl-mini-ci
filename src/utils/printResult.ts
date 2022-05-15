import Table from 'cli-table3'
import { formatSize } from '../utils/util'

export const printResult = (printInfo: any) => {
  const table = new Table({
    head: ['appid', '版本号', '描述', '机器人', '大小', '时间']
  })
  printInfo.forEach((item: any) => {
    table.push([item.appid, item.version, item.desc, item.robot, getSize(item.result.subPackageInfo), new Date().toLocaleString()])
  })
  console.log(table.toString())
}

// 获取大小
export const getSize = (subPackageInfo: any): string => {
  const sizeInfo = subPackageInfo.map((item: any) => {
    return `${[item.name]}:${formatSize(item.size)}`
  })
  return sizeInfo.join(';')
}
