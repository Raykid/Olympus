import IMediator from "olympus-r/engine/mediator/IMediator";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-26
 * @modify date 2017-10-26
 *
 * 为DOM提供皮肤转换的工具集
*/
/**
 * 为中介者包装皮肤
 *
 * @export
 * @param {IMediator} mediator 中介者
 * @param {(HTMLElement|string|string[])} skin 皮肤，可以是HTMLElement，也可以是皮肤字符串，也可以是皮肤模板地址或地址数组
 * @returns {HTMLElement} 皮肤的HTMLElement形式，可能会稍后再填充内容，如果想在皮肤加载完毕后再拿到皮肤请使用complete参数
 */
export declare function wrapSkin(mediator: IMediator, skin: HTMLElement | string | string[]): HTMLElement;
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
/**
 * 转换皮肤为HTMLElement
 *
 * @export
 * @param {(HTMLElement|string|string[])} skin 皮肤
 * @returns {HTMLElement}
 */
export declare function toHTMLElement(skin: HTMLElement | string | string[]): HTMLElement;
/**
 * 将皮肤字符串/字符串数组或皮肤路径转变为HTML内容字符串
 *
 * @export
 * @param {(string|string[])} skin 可以是皮肤字符串、皮肤字符串数组或皮肤路径
 * @returns {string}
 */
export declare function getHTMLContent(skin: string | string[]): string;
