/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * 用来记录程序运行时间，并且提供延迟回调或频率回调功能
*/
export default class System {
    private _nextFrameList;
    private _timer;
    /**
     * 获取从程序运行到当前所经过的毫秒数
     *
     * @returns {number} 毫秒数
     * @memberof System
     */
    getTimer(): number;
    constructor();
    private tick();
    /**
     * 在下一帧执行某个方法
     *
     * @param {Function} handler 希望在下一帧执行的某个方法
     * @param {*} [thisArg] this指向
     * @param {...any[]} args 方法参数列表
     * @returns {ICancelable} 可取消的句柄
     * @memberof System
     */
    nextFrame(handler: Function, thisArg?: any, ...args: any[]): ICancelable;
    /**
     * 每帧执行某个方法，直到取消为止
     *
     * @param {Function} handler 每帧执行的某个方法
     * @param {*} [thisArg] this指向
     * @param {...any[]} args 方法参数列表
     * @returns {ICancelable} 可取消的句柄
     * @memberof System
     */
    enterFrame(handler: Function, thisArg?: any, ...args: any[]): ICancelable;
    /**
     * 设置延迟回调
     *
     * @param {number} duration 延迟毫秒值
     * @param {Function} handler 回调函数
     * @param {*} [thisArg] this指向
     * @param {...any[]} args 要传递的参数
     * @returns {ICancelable} 可取消的句柄
     * @memberof System
     */
    setTimeout(duration: number, handler: Function, thisArg?: any, ...args: any[]): ICancelable;
    /**
     * 设置延时间隔
     *
     * @param {number} duration 延迟毫秒值
     * @param {Function} handler 回调函数
     * @param {*} [thisArg] this指向
     * @param {...any[]} args 要传递的参数
     * @returns {ICancelable} 可取消的句柄
     * @memberof System
     */
    setInterval(duration: number, handler: Function, thisArg?: any, ...args: any[]): ICancelable;
}
export interface ICancelable {
    cancel(): void;
}
/** 再额外导出一个单例 */
export declare const system: System;
