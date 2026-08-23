import type { IPreviewResult } from 'miniprogram-ci/dist/@types/ci/preview'
import type { Options } from './type'
import chalk from 'chalk'
import { preview, Project, upload } from 'miniprogram-ci'

export default class Ci {
  public options: Options
  public project: Project | undefined

  constructor(options: Options) {
    this.options = options

    const { appid, type, projectPath, privateKeyPath, ignores } = options
    this.project = new Project({ appid, type, projectPath, privateKeyPath, ignores })
  }

  /**
   * 预览
   */
  public async preview(): Promise<void | IPreviewResult> {
    if (this.project) {
      try {
        const result = await preview({
          project: this.project,
          ...this.options.preview,
        })
        return result
      }
      catch (error: any) {
        console.error(chalk.red(error.message))
      }
    }
  }

  /**
   * 上传
   */
  public async upload(): Promise<void | IPreviewResult> {
    if (this.project) {
      try {
        const result = await upload({
          project: this.project,
          ...this.options.upload,
        })
        return result
      }
      catch (error: any) {
        console.error(chalk.red(error.message))
      }
    }
  }
}
