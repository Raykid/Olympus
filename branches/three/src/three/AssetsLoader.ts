import { environment } from "olympus-r/engine/env/Environment";
import { version } from "olympus-r/engine/version/Version";
import { joinQueryParams } from "olympus-r/utils/URLUtil";
import { panelManager } from "olympus-r/engine/panel/PanelManager";
import { platformManager } from "olympus-r/engine/platform/PlatformManager";
import { Object3D, Camera, FileLoader, ObjectLoader } from "three";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-02-13
 * @modify date 2018-02-13
 * 
 * 资源加载器
*/

export interface IResource
{
    object:Object3D;
    camera?:Camera;
}

export interface IResourceDict
{
    [url:string]:IResource;
}

export interface ILoaderHandler
{
    /** 加载开始时调度 */
    start?:()=>void;
    /** 加载进行时调度，加载完毕前会频繁调度 */
    progress?:(url:string, totalProgress:number)=>void;
    /** 加载中某个url加载完毕时调度 */
    oneComplete?:(url:string)=>void;
    /** 加载中某个url加载失败时调度 */
    oneError?:(err:Error)=>void;
    /** 加载完毕时调度 */
    complete?:(dict:IResourceDict)=>void;
}

export default class AssetsLoader
{
    private _handler:ILoaderHandler;

    public constructor(handler:ILoaderHandler)
    {
        this._handler = handler;
    }

    public load(urls:string[]):void
    {
        if(urls) urls = urls.concat();
        let handler:ILoaderHandler = this._handler;
        let retryDict:{[name:string]:number} = {};
        let dict:IResourceDict = {};
        let len:number = urls.length;
        // 调用回调
        handler.start && handler.start();
        // 开始加载
        loadNext();
        
        function loadNext():void
        {
            if(urls.length <= 0)
            {
                // 调用回调
                handler.complete && handler.complete(dict);
            }
            else
            {
                // 加载一个
                loadOne(urls.shift());
            }
        }

        function loadOne(url:string, randomVersion:boolean=false):void
        {
            // 处理下url
            let handledUrl:string = environment.toCDNHostURL(url);
            // 添加版本号，有哈希值就用哈希值加载，没有就用编译版本号加载
            handledUrl = version.wrapHashUrl(handledUrl);
            // 加随机版本号
            if(randomVersion)
                handledUrl = joinQueryParams(handledUrl, {_r: Date.now()});
            // 先用FileLoader加载文件
            new FileLoader().load(handledUrl, (text:string)=>{
                // 解析JSON结构
                try
                {
                    let json:any = JSON.stringify(text);
                    switch(json.metadata.type)
                    {
                        case "Object":
                            // 是个3D对象配置，使用ObjectLoader解析之
                            new ObjectLoader().parse(json, (object:Object3D)=>{
                                // 填充配置
                                dict[url] = {object: object};
                                // 调用回调
                                handler.oneComplete && handler.oneComplete(url);
                                // 加载下一个
                                loadNext();
                            });
                            break;
                        case "App":
                            // 是应用程序配置，先用ObjectLoader解析场景
                            new ObjectLoader().parse(json.scene, (object:Object3D)=>{
                                // 再用ObjectLoader解析摄像机
                                new ObjectLoader().parse(json.camera, (camera:Camera)=>{
                                    // 填充配置
                                    dict[url] = {
                                        object: object,
                                        camera: camera
                                    };
                                    // 调用回调
                                    handler.oneComplete && handler.oneComplete(url);
                                    // 加载下一个
                                    loadNext();
                                });
                            });
                            break;
                        default:
                            throw new Error(url + " 不是Three.js配置文件");
                    }
                }
                catch(error)
                {
                    // 不是加载造成的错误，无需重试，直接调用错误回调
                    handler.oneError && handler.oneError(error);
                }
            }, (evt:ProgressEvent)=>{
                // 计算进度
                let countLoaded:number = len - urls.length - 1;
                let prg:number = (countLoaded + (evt.loaded / evt.total)) / len;
                // 调用回调
                handler.progress && handler.progress(url, prg);
            }, (event:ErrorEvent)=>{
                // 加载失败，重试之
                onLoadError(url, event);
            });
        }

        function onLoadError(url:string, evt:ErrorEvent):void
        {
            var retryTimes:number = retryDict[url];
            if(retryTimes == null) retryTimes = 0;
            if(retryTimes < 3)
            {
                retryDict[url] = ++ retryTimes;
                // 打印日志
                console.warn("加载失败，重试第" + retryTimes + "次: " + url);
                // 没到最大重试次数，将为url添加一个随机时间戳重新加回加载队列
                loadOne(url, true);
            }
            else
            {
                // 打印日志
                console.warn("加载失败3次，正在尝试切换CDN...");
                // 尝试切换CDN
                var allDone:boolean = environment.nextCDN();
                if(!allDone)
                {
                    // 重新加载
                    loadOne(url);
                }
                else
                {
                    // 调用模板方法
                    handler.oneError && handler.oneError(evt.error);
                    // 切换CDN失败了，弹出提示，使用户可以手动刷新页面
                    panelManager.confirm("资源加载失败[" + url + "]，点击确定刷新页面", ()=>{
                        platformManager.reload();
                    });
                }
            }
        }
    }
}