/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-05-16
 * @modify date 2018-05-16
 *
 * HTML相关工具
*/
/**
 * 获取当前所在的容器iframe，如果没有则返回null
 *
 * @export
 * @returns {(HTMLIFrameElement|null)}
 */
export declare function getIFrameContainer(): HTMLIFrameElement | null;
/**
 * 获取最根节点的Window实例
 *
 * @export
 * @returns {Window}
 */
export declare function getRootWindow(): Window;
/**
 * 获取当前是否在iframe中
 *
 * @export
 * @returns {boolean}
 */
export declare function isInIframe(): boolean;
