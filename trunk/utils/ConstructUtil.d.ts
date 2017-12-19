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
