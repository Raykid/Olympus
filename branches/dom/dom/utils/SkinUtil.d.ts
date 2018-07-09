/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-26
 * @modify date 2017-10-26
 *
 * 为DOM提供皮肤转换的工具集
*/
/**
 * 判断是否是DOM字符串
 *
 * @export
 * @param {string} str 字符串
 * @returns {boolean}
 */
export declare function isDOMStr(str: string): boolean;
/**
 * 判断是否是DOM模板路径
 *
 * @export
 * @param {string} path 路径字符串
 * @returns {boolean}
 */
export declare function isDOMPath(path: string): boolean;
/**
 * 将from中的所有拥有id属性的节点引用复制到to对象上
 *
 * @export
 * @param {HTMLElement} from 复制源DOM节点
 * @param {*} to 复制目标对象
 */
export declare function copyRef(from: HTMLElement, to: any): void;
export declare function doCopyRef(fromEle: HTMLElement, fromStr: string, to: any): void;
