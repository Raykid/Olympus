'use strict';
module.exports = {
    // 发布路径
    distPath: './dist',
    // webpack入口文件
    entry: {
        index: './index.ts',
    },
    // 默认会拷贝到发布目录
    resources: [
        "./assets",
        './libs',
    ],
    // egret资源路径
    egretPath: './egret',
    // 当前环境
    env: 'dev',
    // 是否在发布过程压缩png32->png8
    usePngmin: false,
    // 使用 "npm run pngmin" 压缩png32->png8, 默认压缩 ["./assets", "./egret"]; 叹号(!)加路径排除不进行压缩的文件，例如["./assets", "./egret", "!./assets/2.png"]
    pngminPath: [
        "./assets",
        "./egret",
    ],
};
