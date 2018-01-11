/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-06
 * @modify date 2017-11-06
 *
 * 绑定工具类
*/
export interface EvalFunc {
    (...scopes: any[]): any;
}
export declare type EvalExp = string | EvalFunc;
/**
 * 创建一个执行方法，用于未来执行
 *
 * @export
 * @param {(EvalExp)} exp 表达式或方法
 * @param {number} [scopeCount=0] 所需的域的数量
 * @returns {EvalFunc} 创建的方法
 */
export declare function createRunFunc(exp: EvalExp, scopeCount?: number): EvalFunc;
/**
 * 直接执行表达式，不求值。该方法可以执行多条语句
 *
 * @export
 * @param {(EvalExp)} exp 表达式或方法
 * @param {*} [thisArg] this指向
 * @param {...any[]} scopes 表达式的作用域列表
 */
export declare function runExp(exp: EvalExp, thisArg?: any, ...scopes: any[]): void;
/**
 * 创建一个表达式求值方法，用于未来执行
 *
 * @export
 * @param {(EvalExp)} exp 表达式或方法
 * @param {number} [scopeCount=0] 所需的域的数量
 * @returns {EvalFunc} 创建的方法
 */
export declare function createEvalFunc(exp: EvalExp, scopeCount?: number): EvalFunc;
/**
 * 表达式求值，无法执行多条语句
 *
 * @export
 * @param {(EvalExp)} exp 表达式或方法
 * @param {*} [thisArg] this指向
 * @param {...any[]} scopes 表达式的作用域列表
 * @returns {*} 返回值
 */
export declare function evalExp(exp: EvalExp, thisArg?: any, ...scopes: any[]): any;
