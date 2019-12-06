#!/usr/bin/env node

const npm = require("npm");
const path = require('path');
const fs = require("fs");
const copy = require("copy");

// 开始拷贝
const cmd = process.argv[2];
if(!cmd) throw new Error("没有提供需要执行的命令");
switch(cmd)
{
	case "init":
		const appName = process.argv[3] || "";
		init(appName);
		break;
	default:
		throw new Error("没有找到命令：" + cmd);
}

function init(appName)
{
	const srcDir = path.join(__dirname, "./template/");
	const distDir = process.cwd();
	// 拷贝所有文件
	copy(srcDir + "/**/*", distDir, function(err, files)
	{
		if(err)
		{
			console.error(err);
		}
		else
		{
			let paths = [
				"./build/release/index.html",
				"./index.ts",
				"./package.json"
			];
			let vars = {
				appName: appName,
				appname: appName.toLowerCase()
			};
			// 开始替换
			for(let tempPath of paths)
			{
				// 替换Main.ts中的变量
				let url = path.join(distDir, tempPath);
				let str = fs.readFileSync(url, "utf8");
				// 替换每一个变量
				for(let tempKey in vars)
				{
					let reg = new RegExp("\\$a\\-\\{" + tempKey + "\\}", "g");
					str = str.replace(reg, vars[tempKey]);
				}
				// 写回文件
				fs.writeFileSync(url, str);
			}
			// 生成.gitignore文件
			str = '/node_modules/\n/.vscode/\n/egret/bin-debug/\n/egret/bin-release/\n/dist/\n/package-lock.json\n.history';
			fs.writeFileSync(path.join(distDir, "./.gitignore"), str);
			// 生成.vscode/launch.json文件
			str = '{\n    // 使用 IntelliSense 了解相关属性。 \n    // 悬停以查看现有属性的描述。\n    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387\n    "version": "0.2.0",\n    "configurations": [\n        {\n            "type": "chrome",\n            "request": "attach",\n            "name": "Attach to Chrome",\n            "port": 9222,\n            "webRoot": "${workspaceRoot}"\n        },\n        {\n            "type": "chrome",\n            "request": "launch",\n            "name": "Launch Chrome against localhost",\n            "url": "http://localhost:8080",\n            "webRoot": "${workspaceRoot}"\n        }\n    ]\n}';
			fs.mkdirSync(".vscode");
			fs.writeFileSync(path.join(distDir, "./.vscode/launch.json"), str);

			// 安装3个olympus库
			npm.load((err, result)=>{
				npm.commands.install(distDir, [], ()=>{
					// 更新库到可用的最新版本
					npm.commands.update([], ()=>{
						// 汇报状态
						console.log("");
						console.log("");
						console.log("脚手架生成完毕。");
						console.log("启动本地调试，请执行“npm run start”");
						console.log("发布打包，请执行“npm run build”");
					});
				});
			});
		}
	});
}