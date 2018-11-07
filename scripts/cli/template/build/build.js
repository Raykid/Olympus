const webpack = require('webpack');
const gulp = require('gulp');
const del = require('del');
const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');
const pngmin = require('gulp-pngmin');
const replace = require('gulp-replace');
const rename = require("gulp-rename");
const wrapVersion = require("olympus-r-version-generator");

const buildConfig = require('./config');

const verName = "V1_0_0"

let env = "dev";

module.exports = function (data) {
    if (data && data.env) {
        env = data.env;
    }
    buildConfig.env = env;
    // 记录编译版本号，如果没有则取当前时间戳
    buildConfig.compileVersion = data.compileVersion || Date.now() + "";

    return new Promise((resolve, reject) => {
        console.log("当前环境是： " + env + "， 执行发布脚本")
        resolve();
    })

        // 清理发布目录
        .then((data) => {
            console.log("-----------------------------------------------");
            console.log("清理发布目录");
            return del(buildConfig.distPath);
        })

        // 编译egret
        .then((data) => {
            return new Promise((resolve, reject) => {
                console.log("-----------------------------------------------");
                console.log("开始执行编译egret");
                // 使用egret自带发布
                exec("egret publish " + buildConfig.egretPath + " --version " + verName, (err, stdout) => {
                    console.log(stdout);
                    console.log("执行完毕");
                    resolve();
                });
            });
        })

        // 拷贝egret依赖库
        .then((data) => {
            return new Promise((resolve, reject) => {
                console.log("-----------------------------------------------");
                console.log("拷贝egret依赖库到发布目录");
                gulp.src(path.join(buildConfig.egretPath, "./libs", "./**/*.min.js"))
                    .pipe(gulp.dest(path.join(buildConfig.distPath, buildConfig.egretPath, "./libs")))
                    .once("end", (evt) => {
                        console.log("拷贝完毕，输出文件到" + buildConfig.distPath);
                        resolve();
                    });
            });
        })

        // 拷贝egret资源
        .then((data) => {
            return new Promise((resolve, reject) => {
                console.log("-----------------------------------------------");
                console.log("拷贝资源到发布目录");
                const publishPath = path.join(buildConfig.egretPath, "./bin-release/web/");
                const json = path.join(publishPath, verName, "resource/**/*.json");
                const png = path.join(publishPath, verName, "resource/**/*.png");
                const jpg = path.join(publishPath, verName, "resource/**/*.jpg");
                gulp.src([json, png, jpg])
                    .pipe(gulp.dest(path.join(buildConfig.distPath, buildConfig.egretPath, "./resource")))
                    .once("end", (evt) => {
                        console.log("拷贝完毕，输出目录：" + buildConfig.distPath);
                        resolve();
                    });
            });
        })

        // 删除egret编译出来的多余文件
        .then((data) => {
            console.log("-----------------------------------------------");
            console.log("删除egret编译出来的多余文件");
            return del(path.join(buildConfig.egretPath, "/bin-release"));
        })

        // 拷贝库文件 resources 配置的目录到 dist
        .then((data) => {
            return new Promise((resolve, reject) => {
                console.log("-----------------------------------------------");
                console.log("拷贝resources配置 " + buildConfig.resources + " 到发布目录");
                let list;
                if (buildConfig.resources instanceof Array) {
                    list = buildConfig.resources.map(item => path.join(item, "**/*"));
                } else {
                    list = path.join(buildConfig.resources, "**/*");
                }
                gulp.src(list, { base: "." })
                    .pipe(gulp.dest(buildConfig.distPath))
                    .once("end", (evt) => {
                        console.log("拷贝完毕，输出文件到" + buildConfig.distPath);
                        resolve();
                    });
            });
        })

        // webpack打包 index
        .then((data) => {
            const prodConfig = require('./webpack.config');
            return new Promise((resolve, reject) => {
                console.log("-----------------------------------------------");
                console.log("开始执行webpack打包");
                webpack(prodConfig, function (err, stats) {
                    if (err) {
                        throw err;
                    }
                    process.stdout.write(stats.toString({
                        colors: false,
                        modules: false,
                        children: false,
                        chunks: false,
                        chunkModules: false
                    }) + '\n\n');

                    if (stats.hasErrors()) {
                        console.log('  webpack打包失败\n');
                        process.exit(1);
                    }

                    console.log('  webpack打包完成\n');
                    resolve();
                });
            });
        })

        // 拷贝 html 模板 到 dist
        .then((data) => {
            return new Promise((resolve, reject) => {
                console.log("-----------------------------------------------");
                console.log("拷贝html模板到发布目录");
                // 拷贝release目录下的模板文件到发布目录
                gulp.src("./build/release/**/*")
                    .pipe(replace('$a-{compileVersion}', buildConfig.compileVersion))
                    .pipe(gulp.dest(buildConfig.distPath))
                    .once("end", (evt) => {
                        console.log("拷贝完毕，输出文件到" + buildConfig.distPath);
                        resolve();
                    });
            });
        })

        // 将 .html 文件拷贝一份并改名为 .vhtml
        .then((data) => {
            return new Promise((resolve, reject) => {
                console.log("-----------------------------------------------");
                console.log("将 .html 文件拷贝一份并改名为 .vhtml");
                gulp.src(path.join(buildConfig.distPath, "*.html"))
                    .pipe(rename(function(path){
                        path.extname = ".vhtml";
                    }))
                    .pipe(gulp.dest(buildConfig.distPath))
                    .once("end", (evt) => {
                        console.log("拷贝完毕，输出文件到" + buildConfig.distPath);
                        resolve();
                    });
            });
        })

        // 压缩 png32->png8
        .then((data) => {
            return new Promise((resolve, reject) => {
                console.log("-----------------------------------------------");
                console.log("压缩PNG8");
                if (buildConfig.usePngmin) {
                    require('./build/pngmin')(buildConfig.pngminPath, buildConfig.distPath, () => {
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        })

        // 统一改名
        .then((data) => {
            return new Promise((resolve, reject) => {
                console.log("-----------------------------------------------");
                console.log("统一添加文件版本号");
                wrapVersion({
                    srcPath: buildConfig.distPath,
                    compileVersion: buildConfig.compileVersion
                });
                resolve();
            });
        })

        .then((data) => {
            return new Promise((resolve, reject) => {
                console.log("-----------------------------------------------");
                console.log("发布脚本执行完毕。");
                resolve(buildConfig.distPath);
            });
        });
}

// 兼容直接调用
const args = process.argv;
for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.substr(0, 6) === '--env-') {
        const env = arg.substr(6);
        module.exports({ env });
    }
}

