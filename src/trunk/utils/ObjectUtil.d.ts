/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-11
 * @modify date 2017-09-11
 *
 * 对象工具集
*/
/**
 * populate properties
 * @param target        目标obj
 * @param sources       来源obj
 */
export declare function extendObject(target: any, ...sources: any[]): any;
/**
 * 复制对象
 * @param target 要复制的对象
 * @param deep 是否深表复制，默认浅表复制
 * @returns {any} 复制后的对象
 */
export declare function cloneObject(target: any, deep?: boolean): any;
/**
 * 生成一个随机ID
 */
export declare function getGUID(): string;
/**
 * 生成自增id（从0开始）
 * @param type
 */
export declare function getAutoIncId(type: string): string;
/**
 * 判断对象是否为null或者空对象
 * @param obj 要判断的对象
 * @returns {boolean} 是否为null或者空对象
 */
export declare function isEmpty(obj: any): boolean;
/**
 * 移除data中包含的空引用或未定义
 * @param data 要被移除空引用或未定义的对象
 */
export declare function trimData(data: any): any;
/**
 * 让child类继承自parent类
 * @param child 子类
 * @param parent 父类
 */
export declare var extendsClass: (child: any, parent: any) => void;
/**
 * 获取一个对象的对象哈希字符串
 *
 * @export
 * @param {*} target 任意对象，可以是基础类型或null
 * @returns {string} 哈希值
 */
export declare function getObjectHash(target: any): string;
/**
 * 获取多个对象的哈希字符串，会对每个对象调用getObjectHash生成单个哈希值，并用|连接
 *
 * @export
 * @param {...any[]} targets 希望获取哈希值的对象列表
 * @returns {string} 多个对象共同作用下的哈希值
 */
export declare function getObjectHashs(...targets: any[]): string;
