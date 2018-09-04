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
