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
     */
    function preload(jsFiles: string[], host?: string, callback?: () => void): void;
}
