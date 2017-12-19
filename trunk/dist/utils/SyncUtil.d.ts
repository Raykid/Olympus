/**
 * 判断是否正在进行操作
 *
 * @export
 * @param {string} name 队列名
 * @returns {boolean} 队列是否正在操作
 */
export declare function isOperating(name: string): boolean;
/**
 * 开始同步操作，所有传递了相同name的操作会被以队列方式顺序执行
 *
 * @export
 * @param name 一个队列的名字
 * @param {Function} fn 要执行的方法
 * @param {*} [thisArg] 方法this对象
 * @param {...any[]} [args] 方法参数
 */
export declare function wait(name: string, fn: Function, thisArg?: any, ...args: any[]): void;
/**
 * 完成一步操作并唤醒后续操作
 *
 * @export
 * @param {string} name 队列名字
 * @returns {void}
 */
export declare function notify(name: string): void;
