const { fork } = require("child_process");
const path = require("path");

start();

async function start(dict)
{
    console.log("开始编译：Preloader.js");
    await run(wrapPath("../node_modules/typescript/bin/tsc"), wrapPath("../src/trunk/Preloader.ts"), "--outFile", wrapPath("../dist/Preloader.js"));
    console.log("开始丑化Preloader.js ==> Preloader.min.js");
    await run(wrapPath("../node_modules/uglify-js/bin/uglifyjs"), wrapPath("../dist/Preloader.js"), "-o", wrapPath("../dist/Preloader.min.js"));
    console.log("完成");
}

function run(cmd, ...args)
{
    return new Promise((resolve)=>{
        fork(cmd, args).on("close", resolve);
    });
}

function wrapPath(p)
{
    return path.resolve(__dirname, p);
}