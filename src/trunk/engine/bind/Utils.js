/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-06
 * @modify date 2017-11-06
 *
 * 绑定工具类
*/
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function wrapEvalFuncExp(exp, scopeCount) {
        var argList = [];
        var expStr = exp;
        for (var i = 0; i < scopeCount; i++) {
            argList.push("s" + i);
            expStr = "with(s" + i + "||{}){" + expStr + "}";
        }
        return Function(argList.join(","), expStr);
    }
    /**
     * 创建一个执行方法，用于未来执行
     *
     * @export
     * @param {string} exp 表达式
     * @param {number} [scopeCount=0] 所需的域的数量
     * @returns {(...scopes:any[])=>void} 创建的方法
     */
    function createRunFunc(exp, scopeCount) {
        if (scopeCount === void 0) { scopeCount = 0; }
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
    exports.createRunFunc = createRunFunc;
    /**
     * 直接执行表达式，不求值。该方法可以执行多条语句
     *
     * @export
     * @param {string} exp 表达式
     * @param {*} [thisArg] this指向
     * @param {...any[]} scopes 表达式的作用域列表
     */
    function runExp(exp, thisArg) {
        var scopes = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            scopes[_i - 2] = arguments[_i];
        }
        createRunFunc(exp, scopes.length).apply(thisArg, scopes);
    }
    exports.runExp = runExp;
    /**
     * 创建一个表达式求值方法，用于未来执行
     *
     * @export
     * @param {string} exp 表达式
     * @param {number} [scopeCount=0] 所需的域的数量
     * @returns {(...scopes:any[])=>any} 创建的方法
     */
    function createEvalFunc(exp, scopeCount) {
        if (scopeCount === void 0) { scopeCount = 0; }
        return createRunFunc("return " + exp, scopeCount);
    }
    exports.createEvalFunc = createEvalFunc;
    /**
     * 表达式求值，无法执行多条语句
     *
     * @export
     * @param {string} exp 表达式
     * @param {*} [thisArg] this指向
     * @param {...any[]} scopes 表达式的作用域列表
     * @returns {*} 返回值
     */
    function evalExp(exp, thisArg) {
        var scopes = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            scopes[_i - 2] = arguments[_i];
        }
        return createEvalFunc(exp, scopes.length).apply(thisArg, scopes);
    }
    exports.evalExp = evalExp;
});
//# sourceMappingURL=Utils.js.map