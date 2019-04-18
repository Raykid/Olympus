function getModuleOpenResult(source, fromIndex)
{
    // 使用正则匹配moduleManager.open(
    const regCode = /moduleManager\s*.\s*open\s*\(/g;
    regCode.lastIndex = fromIndex;
    const result = regCode.exec(source);
    if(!result) return null;
    const pairs = {
        '"': '"',
        "'": "'",
        "`": "`",
        "(": ")",
        "[": "]",
        "{": "}"
    };
    // 首先入栈一个右括号
    const paramStartIndex = result.index + result[0].length;
    const stack = [")"];
    let isInString = false;
    let openParamStr = null;
    for(let i = paramStartIndex, len = source.length; i < len; i ++)
    {
        // 如果栈顶是个\，则无论如何都要忽略并出栈之
        if(stack[0] === "\\")
        {
            stack.shift();
        }
        else
        {
            const char = source.charAt(i);
            // 如果在字符串中，且目标字符不是出栈字符，则忽略
            if(!isInString || char === stack[0])
            {
                // 先判断是否是出栈字符
                if(char === stack[0])
                {
                    // 是，出栈
                    stack.shift();
                }
                // 再判断是否是\，是的话入栈一个\
                else if(char === "\\")
                {
                    stack.unshift("\\");
                }
                // 最后判断是否是个配对的起始字符，是的话入栈一个出栈字符
                else if(pairs[char])
                {
                    stack.unshift(pairs[char]);
                }
            }
        }
        // 如果栈长度为0，则跳出循环
        if(stack.length === 0)
        {
            // i就是结尾索引
            openParamStr = source.substring(paramStartIndex, i);
            break;
        }
    }
    // 如果没找到合法的参数字符串，则返回null
    if(!openParamStr)
    {
        return null;
    }
    // 分析找出来的打开参数字符串
    const resultAnalyse = /^(\w+)([\s\S]*)$/.exec(openParamStr);
    if(!openParamStr)
    {
        return null;
    }
    return {
        moduleName: resultAnalyse[1],
        leftParams: resultAnalyse[2],
        beginIndex: result.index,
        endIndex: paramStartIndex + openParamStr.length + 1
    };
}

module.exports = function(source)
{
    // 声明一个匹配maskManager引用的正则表达式
    const regMaskManager = /import\s+{\s*maskManager\s*}\s+from\s+["']\s*olympus\-r\/engine\/mask\/MaskManager\s*["'];?/;
    let resultCode;
    let fromIndex = 0;
    while(resultCode = getModuleOpenResult(source, fromIndex))
    {
        const { moduleName, leftParams, beginIndex, endIndex } = resultCode;
        // 匹配静态import语句
        const regImport = new RegExp(`\\s*import.*?({\\s*)?(${moduleName})(\\s*})?.*?from\\s+(["'].+["'])\\s*;?`);
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
            fromIndex = source.length;
            // 最后把尾部加上去
            source += tail;
        }
        else
        {
            // 没有引用过，不进行替换，仅将检测位置后移
            fromIndex = endIndex;
        }
    }
    // 返回结果
    return source;
};