/**
 * 遍历平台，合并配置
 */
import chalk from 'chalk'
import { getResult, getFile, replaceJsonFile, git } from '../utils/util'
import { getConfig } from './getConfig'
import { Options, previewOptions, uploadOptions } from "../type"

export const getOptions = async (cmd: any): Promise<Options[]> => {
  const options: Options[] = []

  // 获取配置文件
  const config = getConfig(cmd.config)

  if (!config) { return options }

  // 获取平台
  const platforms = getPlatforms(cmd)

  // 遍历平台
  if (platforms) {
    for (let i = 0; i < platforms.length; i++) {
      const platform = platforms[i]

      // 获取平台配置
      const platformOptions = await getPlatformOptions(config, platform, cmd)

      platformOptions && options.push(platformOptions)
    }
  }

  return options
}

// 获取自定义编译平台
export const getPlatforms = (cmd: any): void | string[] => {
  const platforms = cmd.platforms || ['normal']
  if (!Array.isArray(platforms)) {
    return console.log(chalk.red(`请输入自定义编译平台，多个逗号隔开`))
  }
  return platforms
}

// 获取平台配置
export const getPlatformOptions = async (config: void | Options, platform: string, cmd: any) => {
  const platformConfig = config[platform]
  const { appid, type, projectPath, privateKeyPath, ignores, version, desc, setting, robot, qrcodeFormat, qrcodeOutputDest, pagePath, searchQuery, scene, preview = {}, upload = {} } = platformConfig
  if (!projectPath) {
    return console.log(chalk.red(`请配置项目路径 projectPath`))
  }
  if (!privateKeyPath) {
    return console.log(chalk.red(`请配置私钥路径 privateKeyPath`))
  }
  const options: Options = {
    appid: getAppid(appid, projectPath),
    type: type || 'miniProgram',
    projectPath,
    privateKeyPath,
    ignores,
    preview: {
      version: getVersion(version, preview),
      desc: await getDesc(desc, preview, cmd),
      setting: getSetting(setting, preview, projectPath),
      robot: getResult(preview.robot, robot, 1),
      qrcodeFormat: getResult(preview.qrcodeFormat, qrcodeFormat, 'terminal'),
      qrcodeOutputDest: getResult(preview.qrcodeOutputDest, qrcodeOutputDest) || '',
      pagePath: getResult(preview.pagePath, pagePath),
      searchQuery: getResult(preview.searchQuery, searchQuery),
      scene: getResult(preview.scene, scene, 1011)
    },
    upload: {
      version: getVersion(version, upload),
      desc: await getDesc(desc, upload, cmd),
      setting: getSetting(setting, upload, projectPath),
      robot: getResult(upload.robot, robot, 1)
    }
  }
  return options
}

// 获取appid
export const getAppid = (appid: string, projectPath: string): string => {
  const projectConfig = getFile(`${projectPath}/project.config.json`)
  if (!projectConfig) { return '' }
  // 如果没有传入appid，则使用project.config.json的appid
  if (!appid) {
    return projectConfig.appid
  }
  // 如果传入了appid，则使用传入的appid，并且修改project.config.json的appid
  replaceJsonFile(`${projectPath}/project.config.json`, { appid: `"${appid}"` })
  return appid
}

// 获取版本号
export const getVersion = (version: string, type: previewOptions | uploadOptions) => {
  /**
   * 如果有传入版本号，则使用传入的版本号
   * 如果有传入预览或上传版本号，则使用传入的预览版本号
   * 如果没有传入版本号，则使用当前项目下package.json的version
  */
  const packageJson = getFile(`${process.cwd()}/package.json`)
  return getResult(type.version, version, packageJson.version, '1.0.0')
}

// 获取描述
export const getDesc = async (desc: string, type: previewOptions | uploadOptions, cmd: any): Promise<string> => {
  // 如果有传入描述，则使用传入的描述
  const prefix = cmd.env && typeof cmd.env === 'string' ? cmd.env + ': ' : ''
  if (type.desc || desc) {
    return `${prefix}${getResult(type.desc, desc)}`
  }
  // 如果没有传入描述，则读取git commit, env: @author git commit
  try {
    const log = await git.log({ n: 1 })
    const latest = log.latest
    if (!latest) {
      return `${prefix}`
    }
    return `${prefix}@${latest.author_name} ${latest.message}`
  } catch (err: any) {
    throw new Error(err)
  }
}

// 获取设置
export const getSetting = (setting: string, type: previewOptions | uploadOptions, projectPath: string) => {
  /**
   * 合并设置
  */
  const projectConfig = getFile(`${projectPath}/project.config.json`)
  if (!projectConfig) { return {} }
  const { es6, enhance, minified, minifyWXML, minifyWXSS, uglifyFileName, minify, postcss } = projectConfig.setting
  const result =  {
    es6: !!es6,
    es7: !!enhance,
    minifyJS: !!minified,
    minifyWXML: !!minifyWXML,
    minifyWXSS: !!minifyWXSS,
    minify: !!minify,
    codeProtect: !!uglifyFileName,
    autoPrefixWXSS: !!postcss
  }
  return Object.assign({}, result, setting, type.setting)
}
