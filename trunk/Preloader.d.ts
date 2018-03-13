/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-01
 * @modify date 2017-11-01
 *
 * 预加载器，负责预加载过程
*/
declare namespace olympus {
    /**
     * 预加载方法
     *
     * @export
     * @param {string[]} jsFiles 要加载的js文件列表
     * @param {string} [host] CDN域名，不传则使用当前域名
     * @param {()=>void} [callback] 全部加载完成后的回调
     * @param {boolean} [ordered=false] 是否保证标签形式js的执行顺序，保证执行顺序会降低标签形式js的加载速度，因为必须串行加载。该参数不会影响JSONP形式的加载速度和执行顺序，JSONP形式脚本总是并行加载且顺序执行的。默认是true
     * @param {string} [version] 加载version.cfg文件的版本号，不传则使用随机时间戳作为版本号
     */
    function preload(jsFiles: JSFile[], host?: string, callback?: () => void, ordered?: boolean, version?: string): void;
    enum JSLoadMode {
        AUTO = 0,
        JSONP = 1,
        TAG = 2,
    }
    interface JSFileData {
        url: string;
        mode?: JSLoadMode;
    }
    type JSFile = string | JSFileData;
}
