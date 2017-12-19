/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-01
 * @modify date 2017-11-01
 *
 * Cookie工具
*/
/**
 * 获取cookie值
 *
 * @export
 * @param {string} name cookie名称
 * @returns {string} cookie值
 */
export declare function getCookie(name: string): string;
/**
 * 获取cookie值
 *
 * @export
 * @param {string} name cookie名称
 * @param {*} value cookie值
 * @param {number} [expire] 有效期时长（毫秒）
 */
export declare function setCookie(name: string, value: any, expire?: number): void;
