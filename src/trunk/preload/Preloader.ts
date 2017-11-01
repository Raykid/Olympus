import { getQueryParams, wrapAbsolutePath, isAbsolutePath } from "../utils/URLUtil";
import VersionUtil from "../utils/VersionUtil";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-01
 * @modify date 2017-11-01
 * 
 * 预加载器，负责预加载过程
*/

/**
 * 预加载方法
 * 
 * @export
 * @param {string[]} jsFiles 要加载的js文件列表
 * @param {string} [host] CDN域名，不传则使用当前域名
 * @param {()=>void} [callback] 全部加载完成后的回调
 */
export default function preload(jsFiles:string[], host?:string, callback?:()=>void):void
{
    // 使用host默认值
    if(!host) host = window.location.origin;
    // 首先初始化VersionUtil
    VersionUtil.initialize(preloadOne);
    
    function preloadOne():void
    {
        if(jsFiles.length <= 0)
        {
            callback && callback();
        }
        else
        {
            var url:string = jsFiles.shift();
            // 如果是相对路径，则变为绝对路径
            if(!isAbsolutePath(url))
                url = wrapAbsolutePath(url, host);
            // 添加Version
            url = VersionUtil.wrapHashUrl(url);
            // 请求文件
            var xhr:XMLHttpRequest = (window["XMLHttpRequest"] ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
            xhr.responseType = "text";
            xhr.onreadystatechange = onReadyStateChange;
            xhr.open("GET", url, true);
            xhr.send(null);
        }
    }
    
    function onReadyStateChange(evt:Event):void
    {
        var xhr:XMLHttpRequest = <XMLHttpRequest>evt.target;
        if(xhr.readyState == 4 && xhr.status == 200)
        {
            // 将脚本内容以script标签形式添加到DOM中，这样运行的脚本不会跨域
            var script:HTMLScriptElement = document.createElement("script");
            script.innerHTML = xhr.responseText;
            document.body.appendChild(script);
            // 加载下一个
            preloadOne();
        }
    }
}