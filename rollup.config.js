import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import rollupTypescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import { terser } from 'rollup-plugin-terser'
import copy from 'rollup-plugin-copy'
import pkg from './package.json' // 读取 package.json 配置
const env = process.env.NODE_ENV // 当前运行环境，可通过 cross-env 命令行设置
const name = 'DMWL' // umd 模式的编译结果文件输出的全局变量名称
const config = {
  // 入口文件，src/index.ts
  input: path.resolve(__dirname, 'src/index.ts'),
  // 输出文件
  output: [
    // commonjs
    {
      // package.json 配置的 main 属性
      file: pkg.main,
      format: 'cjs'
    },
    // es module
    {
      // package.json 配置的 module 属性
      file: pkg.module,
      format: 'es'
    },
    // umd
    {
      // umd 导出文件的全局变量
      name,
      // package.json 配置的 umd 属性
      file: pkg.umd,
      format: 'umd'
    }
  ],
  plugins: [
    // 解析第三方依赖
    resolve(),
    // 识别 commonjs 模式第三方依赖
    commonjs(),
    // rollup 编译 typescript
    rollupTypescript(),
    // babel 配置
    babel({
      // 编译库使用
      babelHelpers: 'runtime',
      // 只转换源代码，不转换外部依赖
      exclude: 'node_modules/**',
      // babel 默认不支持 ts 需要手动添加
      extensions: [...DEFAULT_EXTENSIONS, '.ts']
    })
  ]
}
const cli = {
  // 入口文件，src/commands/dmwl-ci.ts
  input: path.resolve(__dirname, 'src/commands/dmwl-ci.ts'),
  // 输出文件
  output: [
    // commonjs
    {
      banner: '#!/usr/bin/env node',
      // package.json 配置的 bin.dmwl-ci 属性
      file: pkg.bin['dmwl-ci'],
      format: 'cjs'
    }
  ],
  plugins: [
    // rollup 编译 typescript
    rollupTypescript(),
    // babel 配置
    babel({
      // 编译库使用
      babelHelpers: 'runtime',
      // 只转换源代码，不转换外部依赖
      exclude: 'node_modules/**',
      // babel 默认不支持 ts 需要手动添加
      extensions: [...DEFAULT_EXTENSIONS, '.ts']
    }),
    copy({
      targets: [
        {
          src: path.resolve(__dirname, 'src/libs/**'),
          dest: './dist/libs'
        }
      ]
    })
  ]
}
// 若打包正式环境，压缩代码
if (env === 'production') {
  [config, cli].forEach(v => {
    v.plugins.push(
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
    )
  })
}

export default [config, cli]
