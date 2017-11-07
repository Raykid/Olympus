/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-06
 * @modify date 2017-11-06
 * 
 * 绑定工具类
*/

function wrapEvalFuncExp(exp:string, scopeCount:number):(...scopes:any[])=>any
{
    var argList:string[] = [];
    var expStr:string = "return " + exp;
    for(var i:number = 0; i < scopeCount; i++)
    {
        argList.push("s" + i);
        expStr = "with(s" + i + "||{}){" + expStr + "}";
    }
    return Function(argList.join(","), expStr) as (...scopes:any[])=>any;
}

/**
 * 创建一个表达式求值方法，用于未来执行
 * 
 * @export
 * @param {string} exp 表达式
 * @param {number} [scopeCount=0] 所需的域的数量
 * @returns {(...scopes:any[])=>any} 创建的方法
 */
export function createEvalFunc(exp:string, scopeCount:number = 0):(...scopes:any[])=>any
{
    var func:(...scopes:any[])=>any;
    try
    {
        func = wrapEvalFuncExp(exp, scopeCount);
    }
    catch(err)
    {
        // 可能是某些版本的解释器不认识模板字符串，将模板字符串变成普通字符串
        var sepStr:string = (exp.indexOf('"') < 0 ? '"' : "'");
        // 将exp中的·替换为'
        var reg:RegExp = /([^\\]?)`/g;
        exp = exp.replace(reg, "$1" + sepStr);
        // 将exp中${...}替换为" + ... + "的形式
        reg = /\$\{(.*?)\}/g;
        exp = exp.replace(reg, sepStr + "+($1)+" + sepStr);
        // 重新生成方法并返回
        func = wrapEvalFuncExp(exp, scopeCount);
    }
    return func;
}

/**
 * 表达式求值，无法执行多条语句
 * 
 * @export
 * @param {string} exp 表达式
 * @param {...any[]} scopes 表达式的作用域列表
 * @returns {*} 返回值
 */
export function evalExp(exp:string, ...scopes:any[]):any
{
    return createEvalFunc(exp, scopes.length).apply(null, scopes);
}

/**
 * 创建一个执行方法，用于未来执行
 * 
 * @export
 * @param {string} exp 表达式
 * @returns {(...scopes:any[])=>any} 创建的方法
 */
export function createRunFunc(exp:string):(...scopes:any[])=>any
{
    return createEvalFunc("(function(){" + exp + "})()");
}

/**
 * 直接执行表达式，不求值。该方法可以执行多条语句
 * 
 * @export
 * @param {string} exp 表达式
 * @param {...any[]} scopes 表达式的作用域列表
 */
export function runExp(exp:string, ...scopes:any[]):void
{
    createRunFunc(exp).apply(null, scopes);
}