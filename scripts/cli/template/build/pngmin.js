const path = require('path');
const fs = require('fs');
const gulp = require('gulp');
const pngmin = require('gulp-pngmin');

/**
 * 压缩
 * 
 * @param {string[]} data 数组
 * @param {Function} callback 压缩完回调
 */
function min(data, basePath, callback) {
    basePath = basePath || "";
    const pathList = data || require('./config').pngminPath || [];
    const directoryList = [];
    const fileList = [];
    const excludeList = [];
    for (let i = 0; i < pathList.length; i += 1) {
        const p = pathList[i];
        let rp;
        if (p.substr(0, 1) === "!") {
            rp = p.substr(1, p.length - 1);
        } else {
            rp = p;
        }
        const stat = fs.statSync(rp);
        if (stat.isFile()) {
            if (p.substr(0, 1) === "!") {
                excludeList.push("!" + path.join(basePath, rp));
            } else {
                fileList.push(path.join(basePath, rp));
            }
        } else if (stat.isDirectory()) {
            directoryList.push(path.join(basePath, rp));
        }
    }


    let promise = new Promise((resolve, reject) => {
        console.log("准备开始压缩png32->png8")
        resolve();
    });

    for (let i = 0; i < directoryList.length; i += 1) {
        const p = directoryList[i];
        promise = promise.then((data) => {
            return new Promise((resolve, reject) => {
                console.log("-----------------------------------------------");
                if (p == null || p === "") {
                    console.log("目录不存在：" + i);
                    resolve();
                } else {
                    console.log("开始压缩目录：" + p + (excludeList.length > 0 ? " 排除路径：" + excludeList : ""));
                    let list = excludeList.concat([path.join(p, "**/*.png")]);
                    gulp.src(list)
                        .pipe(pngmin())
                        .pipe(gulp.dest(p))
                        .once("end", (evt) => {
                            console.log("压缩完毕：" + p);
                            resolve();
                        });
                }

            });
        });
    }

    for (let i = 0; i < fileList.length; i += 1) {
        const p = fileList[i];
        promise = promise.then((data) => {
            return new Promise((resolve, reject) => {
                console.log("-----------------------------------------------");
                if (p == null || p === "") {
                    console.log("文件不存在：" + i);
                    resolve();
                } else {
                    console.log("开始压缩文件：" + p + (excludeList.length > 0 ? " 排除路径：" + excludeList : ""));
                    const list = excludeList.concat([p]);
                    const parse = path.parse(p);
                    gulp.src(list)
                        .pipe(pngmin())
                        .pipe(gulp.dest(parse.dir))
                        .once("end", (evt) => {
                            console.log("压缩完毕：" + p);
                            resolve();
                        });
                }

            });
        });
    }

    promise.then((data) => {
        console.log("-----------------------------------------------");
        console.log("所有png压缩完毕");
        if(callback != null) {
            callback();
        }
    });
}

module.exports = min;

// 兼容直接调用
const args = process.argv;
for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--path") {
        if (args[i + 1] != null) {
            min([args[i + 1]]);
        } else {
            min();
        }
        break;
    }
}
