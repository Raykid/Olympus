/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-09-04
 * @modify date 2018-09-04
 *
 * DOM工具集
*/
/**
 * 获取某个节点在另一节点坐标系中的范围
 *
 * @export
 * @param {HTMLElement} target 目标节点
 * @param {HTMLElement} parent 父容器节点
 * @returns {ClientRect}
 */
export declare function getBoundingClientRect(target: HTMLElement, parent: HTMLElement): ClientRect;
/**
 * 监听Resize
 *
 * @export
 * @param {HTMLElement} target 要监听的对象
 * @param {(target:HTMLElement)=>void} callback Resize回调
 */
export declare function listenResize(target: HTMLElement, callback: (target: HTMLElement) => void): void;
/**
 * 移除Resize监听
 *
 * @export
 * @param {HTMLElement} target 要移除监听的目标节点
 */
export declare function unlistenResize(target: HTMLElement): void;
/**
 * 当目标拥有尺寸时触发Promise
 *
 * @export
 * @param {HTMLElement} target 要丈量的目标节点
 * @returns {Promise<HTMLElement>}
 */
export declare function waitMeasurable(target: HTMLElement): Promise<HTMLElement>;
