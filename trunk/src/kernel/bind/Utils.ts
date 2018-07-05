import { extendObject } from "../../utils/ObjectUtil";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-06
 * @modify date 2017-11-06
 * 
 * 绑定工具类
*/

export interface EvalFunc
{
    (...scopes:any[]):any;
}

export type EvalExp = string | EvalFunc;

function wrapEvalFunc(exp:EvalFunc):EvalFunc
{
    // 这个方法的功能主要是将多个scope合并成为一个scope
    return function(...scopes:any[]):any
    {
        var scope:any = extendObject({}, ...scopes.reverse());
        return exp.call(this, scope);
    };
}

/**
 * 将表达式包装成为方法
 * 
 * @param {(EvalExp)} exp 表达式或方法
 * @param {number} scopeCount 参数个数，仅在exp为表达式时有效
 * @returns {EvalFunc} 包装方法
 */
function wrapEvalFuncExp(exp:EvalExp, scopeCount:number):EvalFunc
{
    if(typeof exp === "string")
    {
        var argList:string[] = [];
        var expStr:string = exp;
        for(var i:number = 0; i < scopeCount; i++)
        {
            argList.push("s" + i);
            expStr = "with(s" + i + "||{}){" + expStr + "}";
        }
        return Function(argList.join(","), expStr) as EvalFunc;
    }
    else
    {
        return wrapEvalFunc(exp);
    }
}

/**
 * 创建一个执行方法，用于未来执行
 * 
 * @export
 * @param {(EvalExp)} exp 表达式或方法
 * @param {number} [scopeCount=0] 所需的域的数量
 * @returns {EvalFunc} 创建的方法
 */
export function createRunFunc(exp:EvalExp, scopeCount:number=0):EvalFunc
{
    if(typeof exp === "string")
    {
        var func:EvalFunc;
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
    else
    {
        return wrapEvalFunc(exp);
    }
}

/**
 * 直接执行表达式，不求值。该方法可以执行多条语句
 * 
 * @export
 * @param {(EvalExp)} exp 表达式或方法
 * @param {*} [thisArg] this指向
 * @param {...any[]} scopes 表达式的作用域列表
 */
export function runExp(exp:EvalExp, thisArg?:any, ...scopes:any[]):void
{
    createRunFunc(exp, scopes.length).apply(thisArg, scopes);
}

/**
 * 创建一个表达式求值方法，用于未来执行
 * 
 * @export
 * @param {(EvalExp)} exp 表达式或方法
 * @param {number} [scopeCount=0] 所需的域的数量
 * @returns {EvalFunc} 创建的方法
 */
export function createEvalFunc(exp:EvalExp, scopeCount:number = 0):EvalFunc
{
    if(typeof exp === "string")
        return createRunFunc("return " + exp, scopeCount);
    else
        return wrapEvalFunc(exp);
}

/**
 * 表达式求值，无法执行多条语句
 * 
 * @export
 * @param {(EvalExp)} exp 表达式或方法
 * @param {*} [thisArg] this指向
 * @param {...any[]} scopes 表达式的作用域列表
 * @returns {*} 返回值
 */
export function evalExp(exp:EvalExp, thisArg?:any, ...scopes:any[]):any
{
    return createEvalFunc(exp, scopes.length).apply(thisArg, scopes);
}