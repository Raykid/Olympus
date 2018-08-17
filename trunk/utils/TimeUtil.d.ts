/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-02-07
 * @modifier yuan.ping
 * @modify date 2018-06-21
 *
 * 时间工具集
*/
/**
 * 格式化本地时间戳
 * 注：时间戳是从格林尼治时间1970年1月1日0时0分0秒开始的
 *
 * @param {number} timestamp 时间戳，单位毫秒
 * @param {string} [format="yyyy-MM-dd hh:mm:ss.S"] 格式，如"yyyy-MM-dd hh:mm:ss.S"
 * @returns {string} 格式化后的时间戳
 */
export declare function formatTimestamp(timestamp: number, format?: string): string;
/**
 * 格式化格林尼治时间戳
 * 注：时间戳是从格林尼治时间1970年1月1日0时0分0秒开始的
 *
 * @param {number} timestamp 时间戳，单位毫秒
 * @param {string} [format="yyyy-MM-dd hh:mm:ss.S"] 格式，如"yyyy-MM-dd hh:mm:ss.S"
 * @returns {string} 格式化后的格林尼治时间戳
 */
export declare function formatUTCTimestamp(timestamp: number, format?: string): string;
/**
 * 格式化时长，与时间戳不同，时长仅代表时间长度。因此仅支持显示d/h/m/s/S
 * 注：如果没有前一个时间维度，则当前维度不会取余，比如如果没有d，则h可能会超过24，以此类推
 *
 * @export
 * @param {number} duration 时长，单位毫秒
 * @param {string} [format="d hh:mm:ss"] 格式，如"d hh:mm:ss.S"
 * @returns {string}
 */
export declare function formatDuration(duration: number, format?: string): string;
