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
export function getCookie(name) {
    if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(name + "=");
        if (start != -1) {
            start = start + name.length + 1;
            var end = document.cookie.indexOf(";", start);
            if (end == -1)
                end = document.cookie.length;
            return decodeURIComponent(document.cookie.substring(start, end));
        }
    }
    return undefined;
}
/**
 * 获取cookie值
 *
 * @export
 * @param {string} name cookie名称
 * @param {*} value cookie值
 * @param {number} [expire] 有效期时长（毫秒）
 */
export function setCookie(name, value, expire) {
    var exstr = "";
    if (expire != null) {
        var exdate = new Date();
        exdate.setMilliseconds(exdate.getMilliseconds() + expire);
        exstr = ";expires=" + exdate.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + exstr;
}
