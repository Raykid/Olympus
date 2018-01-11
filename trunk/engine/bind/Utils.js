import { extendObject } from "../../utils/ObjectUtil";
function wrapEvalFunc(exp) {
    // 这个方法的功能主要是将多个scope合并成为一个scope
    return function () {
        var scopes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            scopes[_i] = arguments[_i];
        }
        var scope = extendObject.apply(void 0, [{}].concat(scopes.reverse()));
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
function wrapEvalFuncExp(exp, scopeCount) {
    if (typeof exp === "string") {
        var argList = [];
        var expStr = exp;
        for (var i = 0; i < scopeCount; i++) {
            argList.push("s" + i);
            expStr = "with(s" + i + "||{}){" + expStr + "}";
        }
        return Function(argList.join(","), expStr);
    }
    else {
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
export function createRunFunc(exp, scopeCount) {
    if (scopeCount === void 0) { scopeCount = 0; }
    if (typeof exp === "string") {
        var func;
        try {
            func = wrapEvalFuncExp(exp, scopeCount);
        }
        catch (err) {
            // 可能是某些版本的解释器不认识模板字符串，将模板字符串变成普通字符串
            var sepStr = (exp.indexOf('"') < 0 ? '"' : "'");
            // 将exp中的·替换为'
            var reg = /([^\\]?)`/g;
            exp = exp.replace(reg, "$1" + sepStr);
            // 将exp中${...}替换为" + ... + "的形式
            reg = /\$\{(.*?)\}/g;
            exp = exp.replace(reg, sepStr + "+($1)+" + sepStr);
            // 重新生成方法并返回
            func = wrapEvalFuncExp(exp, scopeCount);
        }
        return func;
    }
    else {
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
export function runExp(exp, thisArg) {
    var scopes = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        scopes[_i - 2] = arguments[_i];
    }
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
export function createEvalFunc(exp, scopeCount) {
    if (scopeCount === void 0) { scopeCount = 0; }
    if (typeof exp === "string")
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
export function evalExp(exp, thisArg) {
    var scopes = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        scopes[_i - 2] = arguments[_i];
    }
    return createEvalFunc(exp, scopes.length).apply(thisArg, scopes);
}
