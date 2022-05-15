import { program } from 'commander'
const pkg = require('../../package.json')

import { init, preview, upload } from '../index'
import { commaSeparatedList } from "../utils/util"

program
  .version(pkg.version, '-v, --version')
  .usage('[--options ...]')

program
  .command('init')
  .option('-o, --output [path]', '配置文件输出路径')
  .description('生成配置文件')
  .action((cmd: any) => { init(cmd) })

program
  .command('preview')
  .option('-c, --config [path]', '配置文件路径')
  .option('-e, --env [env]', '运行环境')
  .option('-p, --platforms [names]', '自定义编译平台，多个逗号隔开', commaSeparatedList)
  .description('预览')
  .action((cmd: any) => { preview(cmd) })

program
  .command('upload')
  .option('-c, --config [path]', '配置文件路径')
  .option('-e, --env [env]', '运行环境')
  .option('-p, --platforms [names]', '自定义编译平台，多个逗号隔开', commaSeparatedList)
  .description('上传')
  .action((cmd: any) => { upload(cmd) })

program.parse(process.argv)
