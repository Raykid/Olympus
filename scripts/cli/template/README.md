目录说明：
assets 资源目录
build 发布脚本目录
build/release 存放发布需要替换的文件目录
dist 发布目录，重复发布时会清除前一次的文件
egret 白鹭资源和库目录，会拷贝发布后的resource整个目录，libs只会拷贝*.min.js
libs javascript库目录，这个目录只会拷贝*.js
src 代码目录

命令：
npm run dev 调试工程
npm run build 使用release环境编译工程
npm run pngmin 将图片资源压缩为png8
