#!/usr/bin/env node
// #!/usr/bin/env node设置后，可以让系统动态的去查找node，已解决不同机器不同用户设置不一致问题
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
