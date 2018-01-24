import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector"
import { wrapConstruct } from "../../utils/ConstructUtil";
import RequestData from "../net/RequestData";
import ResponseData from "../net/ResponseData";
import { netManager } from "../net/NetManager";
import IModule from "./IModule";
import IModuleConstructor from "./IModuleConstructor";
import ModuleMessage from "./ModuleMessage";
import IModuleMediator from "../mediator/IModuleMediator";
import { environment } from "../env/Environment";
import { maskManager } from "../mask/MaskManager";
import { assetsManager } from "../assets/AssetsManager";
import { audioManager } from "../audio/AudioManager";
import { version } from "../version/Version";
import IObservable from "../../core/observable/IObservable";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-14
 * @modify date 2017-09-15
 * 
 * 模块管理器，管理模块相关的所有操作。模块具有唯一性，同一时间不可以打开两个相同模块，如果打开则会退回到先前的模块处
*/
@Injectable
export default class ModuleManager
{
    private _moduleDict:{[name:string]:IModuleConstructor} = {};
    private _moduleStack:[IModuleConstructor, IModule][] = [];

    private _openCache:[IModuleConstructor, any, boolean][] = [];
    private _opening:IModuleConstructor = null;
    
    /**
     * 获取当前模块
     * 
     * @readonly
     * @type {IModuleConstructor|undefined}
     * @memberof ModuleManager
     */ 
    public get currentModule():IModuleConstructor|undefined
    {
        var curData:[IModuleConstructor, IModule] = this.getCurrent();
        return (curData && curData[0]);
    }

    /**
     * 获取当前模块的实例
     * 
     * @readonly
     * @type {(IModule|undefined)}
     * @memberof ModuleManager
     */
    public get currentModuleInstance():IModule|undefined
    {
        var curData:[IModuleConstructor, IModule] = this.getCurrent();
        return (curData && curData[1]);
    }

    /**
     * 获取活动模块数量
     * 
     * @readonly
     * @type {number}
     * @memberof ModuleManager
     */ 
    public get activeCount():number
    {
        return this._moduleStack.length;
    }

    /**
     * 获取模块在栈中的索引
     * 
     * @param {IModuleConstructor} cls 模块类型
     * @returns {number} 索引值
     * @memberof ModuleManager
     */
    public getIndex(cls:IModuleConstructor):number
    {
        for(var i:number = 0, len:number = this._moduleStack.length; i < len; i++)
        {
            if(this._moduleStack[i][0] == cls) return i;
        }
        return -1;
    }

    /**
     * 获取索引处模块类型
     * 
     * @param {number} index 模块索引值
     * @returns {IModuleConstructor} 模块类型
     * @memberof ModuleManager
     */
    public getModule(index:number):IModuleConstructor
    {
        var data:[IModuleConstructor, IModule] = this._moduleStack[index];
        return data && data[0];
    }

    private getAfter(cls:IModuleConstructor):[IModuleConstructor, IModule][]|null
    {
        var result:[IModuleConstructor, IModule][] = [];
        for(var module of this._moduleStack)
        {
            if(module[0] == cls) return result;
            result.push(module);
        }
        return null;
    }
    
    private getCurrent():[IModuleConstructor, IModule]|undefined
    {
        // 按顺序遍历模块，取出最新的没有在开启中的模块
        var target:[IModuleConstructor, IModule];
        for(var temp of this._moduleStack)
        {
            if(temp[0] !== this._opening)
            {
                target = temp;
                break;
            }
        }
        return target;
    }

    public registerModule(cls:IModuleConstructor):void
    {
        this._moduleDict[cls["name"]] = cls;
    }

    /**
     * 获取模块是否开启中
     * 
     * @param {IModuleConstructor} cls 要判断的模块类型
     * @returns {boolean} 是否开启
     * @memberof ModuleManager
     */
    public isOpened(cls:IModuleConstructor):boolean
    {
        return (this._moduleStack.filter(temp=>temp[0]==cls).length > 0);
    }

    private activateModule(module:IModule, from:IModuleConstructor, data:any):void
    {
        if(module)
        {
            // 调用onActivate接口
            module.onActivate(from, data);
            // 播放背景音乐
            var bgMusic:string = module.bgMusic;
            if(bgMusic)
            {
                // 使用Music音频播放
                audioManager.playMusic({url: bgMusic, loop: true, stopOthers: true});
            }
        }
    }

    private deactivateModule(module:IModule, to:IModuleConstructor, data:any):void
    {
        if(module)
        {
            // 调用onDeactivate接口
            module.onDeactivate(to, data);
        }
    }

    /**
     * 打开模块
     * 
     * @param {IModuleConstructor|string} clsOrName 模块类型或名称
     * @param {*} [data] 参数
     * @param {boolean} [replace=false] 是否替换当前模块
     * @memberof ModuleManager
     */
    public open(clsOrName:IModuleConstructor|string, data?:any, replace:boolean=false):void
    {
        // 如果是字符串则获取引用
        var cls:IModuleConstructor = (typeof clsOrName == "string" ? this._moduleDict[clsOrName] : clsOrName) ;
        // 非空判断
        if(!cls) return;
        // 判断是否正在打开模块
        if(this._opening)
        {
            this._openCache.push([cls, data, replace]);
            return;
        }
        this._opening = cls;
        var after:[IModuleConstructor, IModule][] = this.getAfter(cls);
        if(!after)
        {
            // 尚未打开过，正常开启模块
            var target:IModule = new cls();
            // 赋值打开参数
            target.data = data;
            // 数据先行
            var from:[IModuleConstructor, IModule] = this.getCurrent();
            var fromModule:IModule = from && from[1];
            this._moduleStack.unshift([cls, target]);
            // 记一个是否需要遮罩的flag
            var maskFlag:boolean = true;
            // 加载所有已托管中介者的资源
            var mediators:IModuleMediator[] = target.delegatedMediators.concat();
            var loadMediatorAssets:(err?:Error)=>void = (err?:Error)=>{
                if(err)
                {
                    // 隐藏Loading
                    if(!maskFlag) maskManager.hideLoading("module");
                    maskFlag = false;
                    // 停止加载，调用模块加载失败接口
                    target.onLoadAssets(err);
                }
                else if(mediators.length > 0)
                {
                    var mediator:IModuleMediator = mediators.shift();
                    mediator.loadAssets(loadMediatorAssets);
                }
                else
                {
                    // 隐藏Loading
                    if(!maskFlag) maskManager.hideLoading("module");
                    maskFlag = false;
                    // 调用onLoadAssets接口
                    target.onLoadAssets();
                    // 开始加载css文件，css文件必须用link标签从CDN加载，因为图片需要从CDN加载
                    var cssFiles:string[] = target.listStyleFiles();
                    if(cssFiles)
                    {
                        for(var cssFile of cssFiles)
                        {
                            var cssNode:HTMLLinkElement= document.createElement("link");
                            cssNode.rel = "stylesheet";
                            cssNode.type = "text/css";
                            cssNode.href = environment.toCDNHostURL(version.wrapHashUrl(cssFile));
                            document.body.appendChild(cssNode);
                        }
                    }
                    // 开始加载js文件，这里js文件使用嵌入html的方式，以为这样js不会跨域，报错信息可以收集到
                    assetsManager.loadAssets(target.listJsFiles(), (results:string[]|Error)=>{
                        if(results instanceof Error)
                        {
                            target.onLoadAssets(results);
                            return;
                        }
                        if(results)
                        {
                            // 使用script标签将js文件加入html中
                            var jsNode:HTMLScriptElement = document.createElement("script");
                            jsNode.innerHTML = results.join("\n");
                            document.body.appendChild(jsNode);
                        }
                        // 发送所有模块消息，模块消息默认发送全局内核
                        var requests:RequestData[] = target.listInitRequests();
                        netManager.sendMultiRequests(requests, function(responses:ResponseData[]):void
                        {
                            // 赋值responses
                            target.responses = responses;
                            // 关闭标识符
                            this._opening = null;
                            // 调用open接口
                            target.open(data);
                            // 调用onDeactivate接口
                            this.deactivateModule(fromModule, cls, data);
                            // 调用onActivate接口
                            this.activateModule(target, from && from[0], data);
                            // 如果replace是true，则关掉上一个模块
                            if(replace) this.close(from && from[0], data);
                            // 派发消息
                            core.dispatch(ModuleMessage.MODULE_CHANGE, cls, from && from[0]);
                            // 如果有缓存的模块需要打开则打开之
                            if(this._openCache.length > 0)
                                this.open.apply(this, this._openCache.shift());
                        }, this, target.observable);
                    });
                }
            };
            loadMediatorAssets();
            // 显示Loading
            if(maskFlag)
            {
                maskManager.showLoading(null, "module");
                maskFlag = false;
            }
        }
        else if(after.length > 0)
        {
            // 已经打开且不是当前模块，先关闭当前模块到目标模块之间的所有模块
            for(var i :number = 1, len:number = after.length; i < len; i++)
            {
                this.close(after[i][0], data);
            }
            // 最后关闭当前模块，以实现从当前模块直接跳回到目标模块
            this.close(after[0][0], data);
            // 关闭标识符
            this._opening = null;
        }
        else
        {
            // 关闭标识符
            this._opening = null;
        }
    }

    /**
     * 关闭模块，只有关闭的是当前模块时才会触发onDeactivate和onActivate，否则只会触发close
     * 
     * @param {IModuleConstructor|string} clsOrName 模块类型或名称
     * @param {*} [data] 参数
     * @memberof ModuleManager
     */
    public close(clsOrName:IModuleConstructor|string, data?:any):void
    {
        // 如果是字符串则获取引用
        var cls:IModuleConstructor = (typeof clsOrName == "string" ? this._moduleDict[clsOrName] : clsOrName) ;
        // 非空判断
        if(!cls) return;
        // 数量判断，不足一个模块时不关闭
        if(this.activeCount <= 1) return;
        // 存在性判断
        var index:number = this.getIndex(cls);
        if(index < 0) return;
        // 取到目标模块
        var target:IModule = this._moduleStack[index][1];
        // 如果是当前模块，则需要调用onDeactivate和onActivate接口，否则不用
        if(index == 0)
        {
            // 数据先行
            this._moduleStack.shift();
            // 获取前一个模块
            var to:[IModuleConstructor, IModule] = this._moduleStack[0];
            var toModule:IModule = to && to[1];
            // 调用onDeactivate接口
            this.deactivateModule(target, to && to[0], data);
            // 调用close接口
            target.close(data);
            // 调用onActivate接口
            this.activateModule(toModule, cls, data);
            // 调用onWakeUp接口
            toModule.onWakeUp(cls, data);
            // 派发消息
            core.dispatch(ModuleMessage.MODULE_CHANGE, to && to[0], cls);
        }
        else
        {
            // 数据先行
            this._moduleStack.splice(index, 1);
            // 调用close接口
            target.close(data);
        }
    }
}
/** 再额外导出一个单例 */
export const moduleManager:ModuleManager = core.getInject(ModuleManager);