#!/usr/bin/env node

/**
 * Mac 下运行bin目录可能会有读写权限文件
 *
 * 进入到 bin 目录下运行 chmod 777 ./bin/index.js
 */

/**
 * 手动添加命令行内容
 */
process.argv.push('--cwd')
process.argv.push(process.cwd())
process.argv.push('--gulpfile')
process.argv.push(require.resolve('..'))

require('gulp/bin/gulp')
