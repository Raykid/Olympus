module.exports = function(source)
{
    // 使用正则匹配moduleManager.open
    const regCode = /moduleManager\s*.\s*open\s*\((\w+)([^\)]*)\)/g;
    let resultCode;
    while(resultCode = regCode.exec(source))
    {
        const moduleName = resultCode[1];
        const leftParams = resultCode[2] || "";
        const beginIndex = resultCode.index;
        const endIndex = beginIndex + resultCode[0].length;
        // 匹配静态import语句
        const regImport = new RegExp(`\\s*import\\s+({\\s*)?(${moduleName})(\\s*})?\\s+from\\s+(["'].+["'])\\s*;?`);
        const resultImport = regImport.exec(source);
        if(resultImport)
        {
            // 只有拥有静态import语句的模块才能被替换为动态import
            const importPath = resultImport[4];
            const moduleName = resultImport[1] && resultImport[3] ? resultImport[2] : "default";
            // 先将语句替换为动态import语句
            source = `${source.substring(0, beginIndex)}import(${importPath}).then(function(mod){moduleManager.open(mod.${moduleName}${leftParams});})${source.substr(endIndex)}`;
            // 再移除静态import语句
            source = source.substring(0, resultImport.index) + source.substr(resultImport.index + resultImport[0].length);
        }
    }
    // 返回结果
    return source;
};