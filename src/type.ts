import { Project } from 'miniprogram-ci'

export interface Options {
  appid: string; // 合法的小程序/小游戏 appid
  type: 'miniProgram' | 'miniProgramPlugin' | 'miniGame' | 'miniGamePlugin'; // 项目的类型，默认为 miniProgram
  projectPath: string; // 项目的路径，即 project.config.json 所在的目录
  privateKeyPath: string; // 私钥的路径，即 private.key 所在的目录
  ignores?: string[]; // 指定需要排除的规则
  version?: string; // 自定义版本号
  desc?: string; // 自定义备注，将显示在“小程序助手”开发版列表中
  setting?: any; // 编译设置
  robot?: number; // 指定使用哪一个 ci 机器人，可选值：1 ~ 30
  qrcodeFormat?: 'terminal' | 'image' | 'base64' // 返回二维码文件的格式 "image" 或 "base64"， 默认值 "terminal" 供调试用
  qrcodeOutputDest?: string; // 二维码文件保存路径
  pagePath?: string; // 预览页面路径
  searchQuery?: string; // 预览页面路径启动参数
  scene?: number; // 默认值 1011，具体含义见场景值列表
  preview: previewOptions;
  upload: uploadOptions;
  result?: any;
}

export interface previewOptions {
  project?: Project; // 项目对象
  version: string; // 自定义版本号
  desc: string; // 自定义备注，将显示在“小程序助手”开发版列表中
  setting: any; // 编译设置
  robot: number; // 指定使用哪一个 ci 机器人，可选值：1 ~ 30
  qrcodeFormat: 'terminal' | 'image' | 'base64' // 返回二维码文件的格式 "image" 或 "base64"， 默认值 "terminal" 供调试用
  qrcodeOutputDest: string; // 二维码文件保存路径
  pagePath: string; // 预览页面路径
  searchQuery: string; // 预览页面路径启动参数
  scene: number; // 默认值 1011，具体含义见场景值列表
}

export interface uploadOptions {
  project?: Project; // 项目对象
  version: string; // 自定义版本号
  desc: string; // 自定义备注
  setting: any; // 编译设置
  robot: number; // 指定使用哪一个 ci 机器人，可选值：1 ~ 30
}
