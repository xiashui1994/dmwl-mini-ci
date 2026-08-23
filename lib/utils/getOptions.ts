import type { Options, previewOptions, uploadOptions } from '../type'
import process from 'node:process'
import chalk from 'chalk'
import { getFile, getResult, git, replaceJsonFile } from '../utils/util'
import { getConfig } from './getConfig'

export async function getOptions(cmd: any): Promise<Options[]> {
  const options: Options[] = []

  const config = await getConfig(cmd.config)

  if (!config) {
    return options
  }

  const platforms = getPlatforms(cmd)

  if (platforms) {
    for (let i = 0; i < platforms.length; i++) {
      const platform = platforms[i]
      const platformOptions = await getPlatformOptions(config, platform, cmd)
      if (platformOptions) {
        options.push(platformOptions)
      }
    }
  }

  return options
}

export function getPlatforms(cmd: any): void | string[] {
  const platforms = cmd.platforms || ['normal']
  if (!Array.isArray(platforms)) {
    console.warn(chalk.red(`请输入自定义编译平台，多个逗号隔开`))
    return
  }
  return platforms
}

export async function getPlatformOptions(config: Options, platform: string, cmd: any) {
  const platformConfig = config[platform as keyof Options]
  if (!platformConfig) {
    return
  }
  const { appid, type, projectPath, privateKeyPath, ignores, version, desc, setting, robot, qrcodeFormat, qrcodeOutputDest, pagePath, searchQuery, scene, preview = {}, upload = {} } = platformConfig as any
  if (!projectPath) {
    console.warn(chalk.red(`请配置项目路径 projectPath`))
    return
  }
  if (!privateKeyPath) {
    console.warn(chalk.red(`请配置私钥路径 privateKeyPath`))
    return
  }
  const options: Options = {
    appid: await getAppid(appid, projectPath),
    type: type || 'miniProgram',
    projectPath,
    privateKeyPath,
    ignores,
    preview: {
      version: await getVersion(version, preview),
      desc: await getDesc(desc, preview, cmd),
      setting: await getSetting(setting, preview, projectPath),
      robot: getResult(preview.robot, robot, 1),
      qrcodeFormat: getResult(preview.qrcodeFormat, qrcodeFormat, 'terminal'),
      qrcodeOutputDest: getResult(preview.qrcodeOutputDest, qrcodeOutputDest) || '',
      pagePath: getResult(preview.pagePath, pagePath),
      searchQuery: getResult(preview.searchQuery, searchQuery),
      scene: getResult(preview.scene, scene, 1011),
    },
    upload: {
      version: await getVersion(version, upload),
      desc: await getDesc(desc, upload, cmd),
      setting: await getSetting(setting, upload, projectPath),
      robot: getResult(upload.robot, robot, 1),
    },
  }
  return options
}

export async function getAppid(appid: string, projectPath: string): Promise<string> {
  const projectConfig = await getFile(`${projectPath}/project.config.json`)
  if (!projectConfig) {
    return ''
  }
  if (!appid) {
    return projectConfig.appid
  }
  replaceJsonFile(`${projectPath}/project.config.json`, { appid: `"${appid}"` })
  return appid
}

export async function getVersion(version: string, type: previewOptions | uploadOptions) {
  const packageJson = await getFile(`${process.cwd()}/package.json`)
  return getResult(type.version, version, packageJson.version, '1.0.0')
}

export async function getDesc(desc: string, type: previewOptions | uploadOptions, cmd: any): Promise<string> {
  const prefix = cmd.env && typeof cmd.env === 'string' ? `${cmd.env}: ` : ''
  if (type.desc || desc) {
    return `${prefix}${getResult(type.desc, desc)}`
  }
  try {
    const log = await git.log({ n: 1 })
    const latest = log.latest
    if (!latest) {
      return `${prefix}`
    }
    return `${prefix}@${latest.author_name} ${latest.message}`
  }
  catch (err: any) {
    throw new Error(err)
  }
}

export async function getSetting(setting: string, type: previewOptions | uploadOptions, projectPath: string) {
  const projectConfig = await getFile(`${projectPath}/project.config.json`)
  if (!projectConfig) {
    return {}
  }
  const { es6, enhance, minified, minifyWXML, minifyWXSS, uglifyFileName, minify, postcss } = projectConfig.setting
  const result = {
    es6: !!es6,
    es7: !!enhance,
    minifyJS: !!minified,
    minifyWXML: !!minifyWXML,
    minifyWXSS: !!minifyWXSS,
    minify: !!minify,
    codeProtect: !!uglifyFileName,
    autoPrefixWXSS: !!postcss,
  }
  return Object.assign({}, result, setting, type.setting)
}
