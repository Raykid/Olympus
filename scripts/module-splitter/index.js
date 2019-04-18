module.exports = function(source)
{
    // 使用正则匹配moduleManager.open
    const regCode = /moduleManager\s*.\s*open\s*\((\w+)([^\)]*)\)/g;
    // 声明一个匹配maskManager引用的正则表达式
    const regMaskManager = /import\s+{\s*maskManager\s*}\s+from\s+["']\s*olympus\-r\/engine\/mask\/MaskManager\s*["'];?/;
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
            // 将语句替换为动态import语句，无需移除静态引用，因为webpack会剔除掉无用引用
            const tail = source.substr(endIndex);
            source = `${source.substring(0, beginIndex)}(async ()=>{
                maskManager.showLoading(null, "__load_module__");
                const mod = await import(${importPath});
                maskManager.hideLoading("__load_module__");
                return await moduleManager.open(mod.${moduleName}${leftParams});
            })()`;
            // 确保引用了maskManager
            if(!regMaskManager.test(source))
            {
                source = "import { maskManager } from 'olympus-r/engine/mask/MaskManager';\n" + source;
            }
            // 修改moduleManager.open正则表达式的匹配位置
            regCode.lastIndex = source.length;
            // 最后把尾部加上去
            source += tail;
        }
    }
    // 返回结果
    return source;
};