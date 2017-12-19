/**
 * 创建一个执行方法，用于未来执行
 *
 * @export
 * @param {string} exp 表达式
 * @param {number} [scopeCount=0] 所需的域的数量
 * @returns {(...scopes:any[])=>void} 创建的方法
 */
export declare function createRunFunc(exp: string, scopeCount?: number): (...scopes: any[]) => void;
/**
 * 直接执行表达式，不求值。该方法可以执行多条语句
 *
 * @export
 * @param {string} exp 表达式
 * @param {*} [thisArg] this指向
 * @param {...any[]} scopes 表达式的作用域列表
 */
export declare function runExp(exp: string, thisArg?: any, ...scopes: any[]): void;
/**
 * 创建一个表达式求值方法，用于未来执行
 *
 * @export
 * @param {string} exp 表达式
 * @param {number} [scopeCount=0] 所需的域的数量
 * @returns {(...scopes:any[])=>any} 创建的方法
 */
export declare function createEvalFunc(exp: string, scopeCount?: number): (...scopes: any[]) => any;
/**
 * 表达式求值，无法执行多条语句
 *
 * @export
 * @param {string} exp 表达式
 * @param {*} [thisArg] this指向
 * @param {...any[]} scopes 表达式的作用域列表
 * @returns {*} 返回值
 */
export declare function evalExp(exp: string, thisArg?: any, ...scopes: any[]): any;
