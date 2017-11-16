const { fork } = require("child_process");
const path = require("path");

start();

async function start(dict)
{
    console.log("开始编译 Preloader.js");
    await run(wrapPath("../node_modules/typescript/bin/tsc"), wrapPath("../src/trunk/Preloader.ts"), "--outFile", wrapPath("../dist/Preloader.js"));
    console.log("开始丑化 Preloader.js ==> Preloader.min.js");
    await run(wrapPath("../node_modules/uglify-js/bin/uglifyjs"), wrapPath("../dist/Preloader.js"), "-o", wrapPath("../dist/Preloader.min.js"));
    console.log("开始编译 Olympus.js");
    await run(wrapPath("../node_modules/typescript/bin/tsc"), "-p", wrapPath("../src/trunk/tsconfig.json"));
    await run(wrapPath("../node_modules/typescript/bin/tsc"), "-p", wrapPath("../src/trunk/tsconfig_deploy.json"));
    console.log("开始丑化 Olympus.js ==> Olympus.min.js");
    await run(wrapPath("../node_modules/uglify-js/bin/uglifyjs"), wrapPath("../dist/Olympus.js"), "-o", wrapPath("../dist/Olympus.min.js"));
    console.log("开始编译 DOM.js");
    await run(wrapPath("../node_modules/typescript/bin/tsc"), "-p", wrapPath("../src/branches/dom/tsconfig.json"));
    console.log("开始丑化 DOM.js ==> DOM.min.js");
    await run(wrapPath("../node_modules/uglify-js/bin/uglifyjs"), wrapPath("../dist/DOM.js"), "-o", wrapPath("../dist/DOM.min.js"));
    console.log("开始编译 Egret.js");
    await run(wrapPath("../node_modules/typescript/bin/tsc"), "-p", wrapPath("../src/branches/egret/tsconfig.json"));
    await run(wrapPath("../node_modules/typescript/bin/tsc"), "-p", wrapPath("../src/branches/egret/tsconfig_deploy.json"));
    console.log("开始丑化 Egret.js ==> Egret.min.js");
    await run(wrapPath("../node_modules/uglify-js/bin/uglifyjs"), wrapPath("../dist/Egret.js"), "-o", wrapPath("../dist/Egret.min.js"));
    console.log("开始编译 index.js");
    await run(wrapPath("../node_modules/typescript/bin/tsc"), "-p", wrapPath("../src/tsconfig.json"));
    await run(wrapPath("../node_modules/typescript/bin/tsc"), "-p", wrapPath("../src/tsconfig_deploy.json"));
    console.log("开始丑化 index.js ==> index.min.js");
    await run(wrapPath("../node_modules/uglify-js/bin/uglifyjs"), wrapPath("../dist/index.js"), "-o", wrapPath("../dist/index.min.js"));
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