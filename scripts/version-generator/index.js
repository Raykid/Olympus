const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// 为目录下所有文件（除了version.cfg以外）生成hash值，并替换文件名
module.exports = function({ srcPath, hashLen })
{
    const versions = [];
    handle(versions, srcPath, srcPath, hashLen == null ? 10 : parseInt(hashLen));
    // 写文件
    fs.writeFileSync(path.join(srcPath, "version.cfg"), versions.join("\n"));
};

function handle(versions, srcPath, rootPath, hashLen)
{
    const stat = fs.statSync(srcPath);
    if(stat.isDirectory())
    {
        handleDirectory(versions, srcPath, rootPath, hashLen);
    }
    else if(stat.isFile())
    {
        handleFile(versions, srcPath, rootPath, hashLen);
    }
}

function handleDirectory(versions, dirPath, rootPath, hashLen)
{
    for(let name of fs.readdirSync(dirPath))
    {
        handle(versions, path.join(dirPath, name), rootPath, hashLen);
    }
}

function handleFile(versions, filePath, rootPath, hashLen)
{
    // 如果是version.cfg本身则不处理
    if(filePath === path.join(rootPath, "version.cfg"))
    {
        return;
    }
    // 读取文件内容
    const buffer = fs.readFileSync(filePath);
    // 获取文件hash
    const hash = crypto.createHash("md5").update(buffer).digest("hex").substr(0, hashLen);
    // 改名
    fs.renameSync(filePath, joinVersion(filePath, hash));
    // 整理路径，分隔符为\的改成/，头部没有./的加上
    filePath = filePath.replace(/\\+/g, "/");
    if(filePath.substr(0, 2) !== "./")
    {
        filePath = "./" + filePath;
    }
    versions.push(`${hash}  ${filePath}`);
}

function joinVersion(url, version)
{
    if(version == null) return url;
    // 去掉version中的非法字符
    version = version.replace(/[^0-9a-z]+/ig, "");
    // 插入版本号
    var reg = /(([a-zA-Z]+:\/+[^\/\?#]+\/)?[^\?#]+)\.([^\?]+)(\?.+)?/;
    var result = reg.exec(url);
    if(result != null)
    {
        url = result[1] + "-r_" + version + "." + result[3] + (result[4] || "");
    }
    return url;
}