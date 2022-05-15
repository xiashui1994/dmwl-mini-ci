import { Project, upload, preview } from 'miniprogram-ci'
import { Options } from './type'
import chalk from 'chalk'

export default class Ci {
  public options: Options
  public project: Project | undefined;

  constructor(options: Options) {
    this.options = options

    const { appid, type, projectPath, privateKeyPath, ignores } = options
    this.project = new Project({ appid, type, projectPath, privateKeyPath, ignores })
  }

  /**
   * 预览
   */
  public async preview() {
    if (this.project) {
      try {
        const result = await preview({
          project: this.project,
          ...this.options.preview
        })
        return result
      } catch (error: any) {
        return console.log(chalk.red(error.message))
      }
    }
  }

  /**
   * 上传
   */
  public async upload() {
    if (this.project) {
      try {
        const result = await upload({
          project: this.project,
          ...this.options.upload
        })
        return result
      } catch (error: any) {
        return console.log(chalk.red(error.message))
      }
    }
  }
}
