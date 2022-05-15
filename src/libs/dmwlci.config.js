module.exports = {
  normal: {
    appid: '', // 合法的小程序/小游戏 appid
    type: 'miniProgram', // 'miniProgram' | 'miniProgramPlugin' | 'miniGame' | 'miniGamePlugin'; 项目的类型，默认为 miniProgram
    projectPath: '', // 项目的路径，即 project.config.json 所在的目录
    privateKeyPath: '', // 私钥的路径，即 private.key 所在的目录
    ignores: [], // 指定需要排除的规则
    version: '', // 自定义版本号
    desc: '', // 自定义备注，将显示在“小程序助手”开发版列表中
    setting: {}, // 编译设置
    robot: 1, // 指定使用哪一个 ci 机器人，可选值：1 ~ 30
    qrcodeFormat: '', // 返回二维码文件的格式 "image" 或 "base64"， 默认值 "terminal" 供调试用
    qrcodeOutputDest: '', // 二维码文件保存路径
    pagePath: '', // 预览页面路径
    searchQuery: '', // 预览页面路径启动参数
    scene: '', // 默认值 1011，具体含义见场景值列表
    preview: {
      version: '', // 自定义版本号
      desc: '', // 自定义备注，将显示在“小程序助手”开发版列表中
      setting: {}, // 编译设置
      robot: 1, // 指定使用哪一个 ci 机器人，可选值：1 ~ 30
      qrcodeFormat: '', // 返回二维码文件的格式 "image" 或 "base64"， 默认值 "terminal" 供调试用
      qrcodeOutputDest: '', // 二维码文件保存路径
      pagePath: '', // 预览页面路径
      searchQuery: '', // 预览页面路径启动参数
      scene: '' // 默认值 1011，具体含义见场景值列表
    },
    upload: {
      version: '', // 自定义版本号
      desc: '', // 自定义备注，将显示在“小程序助手”开发版列表中
      setting: {}, // 编译设置
      robot: 1 // 指定使用哪一个 ci 机器人，可选值：1 ~ 30
    }
  }
}
