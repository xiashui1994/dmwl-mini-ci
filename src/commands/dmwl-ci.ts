const { program } = require('commander')
const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')
const chalk = require('chalk')
const pkg = require('../../package.json')

let outputPath = 'dmwlci.config.js'

program
  .version(pkg.version, '-v, --version')
  .usage('[--options ...]')

program
  .command('init')
  .option('-o, --output [path]', '配置文件输出路径')
  .description('生成配置文件')
  .action((cmd: any) => {
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
  })

// 没有任何命令的时候输出使用帮助
if (!process.argv.slice(2).length) {
  program.outputHelp()
}

program.parse(process.argv)
