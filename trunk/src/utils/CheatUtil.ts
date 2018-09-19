/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-09-19 12:30:26
 * @modify date 2018-09-19 12:30:26
 * @desc [description] 秘技工具集
*/
function getTargetCodes(cheatCode:string|(number|string)[]):number[]
{
    const targetCodes:number[] = [];
    if(typeof cheatCode === "string")
    {
        targetCodes.push.apply(targetCodes, stringToCharCodes(cheatCode));
    }
    else
    {
        for(let temp of cheatCode)
        {
            if(typeof temp === "number")
                targetCodes.push(temp);
            else
                targetCodes.push.apply(targetCodes, stringToCharCodes(temp));
        }
    }
    return targetCodes;
}

function stringToCharCodes(str:string):number[]
{
    return str.split("").map(char=>char.charCodeAt(0));
}

function getConsistency(inputCodes:number[], targetCodes:number[]):number
{
    const inputCount:number = inputCodes.length;
    // 计算命中数量
    let hitCount:number;
    for(hitCount = 0; hitCount < inputCount; hitCount++)
    {
        const inputCode:number = inputCodes[hitCount];
        const targetCode:number = targetCodes[hitCount];
        if(inputCode == null || targetCode == null || inputCode !== targetCodes[hitCount])
            return 0;
    }
    // 返回一致性
    return hitCount / targetCodes.length;
}

export function keyboardCheat(cheatCode:string|(number|string)[], handler:()=>void):void
{
    // 整合键位列表
    const targetCodes:number[] = getTargetCodes(cheatCode);
    // 缓存键位数据
    const inputCodes:number[] = [];
    // 监听键盘事件
    window.addEventListener("keypress", evt=>{
        // 抬起时的键值必须是栈顶键值，否则不作数
        const code:number = evt.charCode;
        inputCodes.push(code);
        // 判断一致性
        const consistency:number = getConsistency(inputCodes, targetCodes);
        if(consistency === 0)
        {
            // 一致性为0，匹配失败，清空缓存数组，并将当前键值推入数组
            inputCodes.splice(0, inputCodes.length, code);
        }
        else if(consistency === 1)
        {
            // 完全一致，调用回调并清空缓存数组
            inputCodes.splice(0, inputCodes.length);
            handler();
        }
    });
}