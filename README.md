# dmwl-mini-ci

微信小程序、小游戏 CI 发布工具

## 安装

```bash
npm install dmwl-mini-ci -g
```

## 使用

### 生成配置文件

```bash
dmwl-mini-ci init
```

### 预览

```bash
dmwl-mini-ci preview -c ./dmwlci.config.mjs
```

### 上传

```bash
dmwl-mini-ci upload -c ./dmwlci.config.mjs
```

## 配置说明

```js
export default {
  normal: {
    appid: '', // 小程序 appid
    type: 'miniProgram', // 项目类型
    projectPath: '', // 项目路径
    privateKeyPath: '', // 私钥路径
    version: '', // 版本号
    desc: '', // 描述
    robot: 1, // CI 机器人 (1-30)
  },
}
```

## 开发

```bash
pnpm install
pnpm build
pnpm lint
```

## License

MIT
