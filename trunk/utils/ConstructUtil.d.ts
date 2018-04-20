import IConstructor from "../core/interfaces/IConstructor";
/**
 * 包装一个类型，监听类型的实例化操作
 *
 * @export
 * @param {IConstructor} cls 要监听构造的类型构造器
 * @returns {IConstructor} 新的构造函数
 */
export declare function wrapConstruct(cls: IConstructor): IConstructor;
/**
 * 如果传入的类有包装类，则返回包装类，否则返回其本身
 *
 * @export
 * @param {IConstructor} cls 要获取包装类的类构造函数
 * @returns {IConstructor}
 */
export declare function getConstructor(cls: IConstructor): IConstructor;
/**
 * 监听类型的实例化
 *
 * @export
 * @param {IConstructor} cls 要监听实例化的类
 * @param {(instance?:any)=>void} handler 处理函数
 */
export declare function listenConstruct(cls: IConstructor, handler: (instance?: any) => void): void;
/**
 * 移除实例化监听
 *
 * @export
 * @param {IConstructor} cls 要移除监听实例化的类
 * @param {(instance?:any)=>void} handler 处理函数
 */
export declare function unlistenConstruct(cls: IConstructor, handler: (instance?: any) => void): void;
/**
 * 监听类型销毁（如果能够销毁的话，需要类型具有dispose方法），该监听不需要移除
 *
 * @export
 * @param {IConstructor} cls 要监听销毁的类
 * @param {(instance?:any)=>void} handler 处理函数
 */
export declare function listenDispose(cls: IConstructor, handler: (instance?: any) => void): void;
/**
 * 监听某个实例的某个方法调用，并插入逻辑
 *
 * @export
 * @param {IConstructor|any} target 要监听的对象类型或实例
 * @param {string} name 要监听调用的方法名
 * @param {(instance:any, args?:any[])=>any[]|void} [before] 执行前调用的回调，如果有返回值则替换掉正式方法执行时的参数
 * @param {(instance:any, args?:any[], result?:any)=>any} [after] 执行后调用的回调，可以接收正式方法的返回值，如果after有返回值则替换掉正式方法的返回值
 * @param {boolean} [once=true] 是否是一次性监听，默认是true
 */
export declare function listenApply(target: IConstructor | any, name: string, before?: (instance: any, args?: any[]) => any[] | void, after?: (instance: any, args?: any[], result?: any) => any, once?: boolean): void;
