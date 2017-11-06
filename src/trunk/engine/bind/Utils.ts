/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-06
 * @modify date 2017-11-06
 * 
 * 绑定工具类
*/

/**
 * 创建一个表达式求值方法，用于未来执行
 * @param exp 表达式
 * @returns {Function} 创建的方法
 */
export function createEvalFunc(exp:string):(scope:any)=>any
{
    var func:(scope:any)=>any;
    try
    {
        func = Function("scope", "with(scope){return " + exp + "}") as (scope:any)=>any;
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
        func = Function("scope", "with(scope){return " + exp + "}") as (scope:any)=>any;
    }
    return func;
}

/**
 * 表达式求值，无法执行多条语句
 * @param exp 表达式
 * @param scope 表达式的作用域
 * @returns {any} 返回值
 */
export function evalExp(exp:string, scope:any):any
{
    return createEvalFunc(exp)(scope);
}

/**
 * 创建一个执行方法，用于未来执行
 * @param exp 表达式
 * @returns {Function} 创建的方法
 */
export function createRunFunc(exp:string):(scope:any)=>void
{
    return createEvalFunc("(function(){" + exp + "})()");
}

/**
 * 直接执行表达式，不求值。该方法可以执行多条语句
 * @param exp 表达式
 * @param scope 表达式的作用域
 */
export function runExp(exp:string, scope:any):void
{
    createRunFunc(exp)(scope);
}