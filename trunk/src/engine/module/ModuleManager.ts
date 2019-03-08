import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
import { getConstructor } from "../../utils/ConstructUtil";
import IMediator from "../mediator/IMediator";
import IMediatorConstructor from "../mediator/IMediatorConstructor";
import { ModuleOpenStatus } from "../mediator/IMediatorModulePart";
import { getModule, ModuleType } from "../mediator/Mediator";
import ModuleMessage from "./ModuleMessage";

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
    private _moduleStack:ModuleData[] = [];

    private _openCache:[ModuleType, any, boolean, (data:any)=>void][] = [];
    private _opening:ModuleType = null;
    private _busy:boolean = false;
    
    /**
     * 获取当前模块
     * 
     * @readonly
     * @type {IMediatorConstructor|undefined}
     * @memberof ModuleManager
     */ 
    public get currentModule():IMediatorConstructor|undefined
    {
        var curData:ModuleData = this.getCurrent();
        return (curData && curData[0]);
    }

    /**
     * 获取当前模块的实例
     * 
     * @readonly
     * @type {(IMediator|undefined)}
     * @memberof ModuleManager
     */
    public get currentModuleInstance():IMediator|undefined
    {
        var curData:ModuleData = this.getCurrent();
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
     * @param {IMediatorConstructor} cls 模块类型
     * @returns {number} 索引值
     * @memberof ModuleManager
     */
    public getIndex(cls:IMediatorConstructor):number
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
     * @returns {IMediatorConstructor} 模块类型
     * @memberof ModuleManager
     */
    public getModule(index:number):IMediatorConstructor
    {
        var data:ModuleData = this._moduleStack[index];
        return data && data[0];
    }

    private getAfter(cls:IMediatorConstructor):ModuleData[]|null
    {
        var result:ModuleData[] = [];
        for(var module of this._moduleStack)
        {
            if(module[0] == cls) return result;
            result.push(module);
        }
        return null;
    }
    
    private getCurrent():ModuleData|undefined
    {
        // 按顺序遍历模块，取出最新的没有在开启中的模块
        var target:ModuleData;
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

    /**
     * 获取模块是否开启中
     * 
     * @param {IMediatorConstructor} cls 要判断的模块类型
     * @returns {boolean} 是否开启
     * @memberof ModuleManager
     */
    public isOpened(cls:IMediatorConstructor):boolean
    {
        return (this._moduleStack.filter(temp=>temp[0]==cls).length > 0);
    }

    private activateModule(module:IMediator, from:IMediator, data:any):void
    {
        if(module)
        {
            // 调用activate接口
            module.activate(from, data);
        }
    }

    private deactivateModule(module:IMediator, to:IMediator, data:any):void
    {
        if(module)
        {
            // 调用deactivate接口
            module.deactivate(to, data);
        }
    }

    /**
     * 打开模块
     * 
     * @param {ModuleType|string} clsOrName 模块类型或名称
     * @param {*} [data] 参数
     * @param {boolean} [replace=false] 是否替换当前模块
     * @memberof ModuleManager
     */
    public open(module:ModuleType|string, data?:any, replace:boolean=false):Promise<any>
    {
        return new Promise(async resolve=>{
            // 如果是字符串则获取引用
            var type:ModuleType = (typeof module == "string" ? getModule(module) : module) ;
            // 非空判断
            if(!type) return;
            // 判断是否正在打开模块
            if(this._busy)
            {
                this._openCache.push([type, data, replace, resolve]);
                return;
            }
            this._busy = true;
            // 取到类型
            var cls:IMediatorConstructor = <IMediatorConstructor>getConstructor(type instanceof Function ? type : <IMediatorConstructor>type.constructor);
            var after:ModuleData[] = this.getAfter(cls);
            if(!after)
            {
                // 记录正在打开的模块类型
                this._opening = type;
                // 尚未打开过，正常开启模块
                var target:IMediator = type instanceof Function ? new cls() : type;
                // 赋值打开参数
                target.data = data;
                // 数据先行
                var from:ModuleData = this.getCurrent();
                var fromModule:IMediator = from && from[1];
                var moduleData:ModuleData = [cls, target, null];
                this._moduleStack.unshift(moduleData);
                // 设置回调
                target.moduleOpenHandler = async (status:ModuleOpenStatus, err?:Error)=>{
                    switch(status)
                    {
                        case ModuleOpenStatus.Stop:
                            // 需要判断是否是最后一个模块，最后一个模块不允许被销毁
                            if(this._moduleStack.length > 1)
                            {
                                // 移除先行数据
                                var tempData:ModuleData = this._moduleStack.shift();
                                // 销毁模块
                                tempData[1].dispose();
                            }
                            // 派发失败消息
                            core.dispatch(ModuleMessage.MODULE_CHANGE_FAILED, cls, from && from[0], err);
                            // 结束一次模块开启
                            await this.onFinishOpen();
                            break;
                        case ModuleOpenStatus.BeforeOpen:
                            // 这里要优先关闭标识符，否则在开启的模块的onOpen方法里如果有操作Mask的动作就会被这个标识阻塞住
                            this._opening = null;
                            // 篡改target的close方法，使其改为触发ModuleManager的close
                            moduleData[2] = target.hasOwnProperty("close") ? target.close : null;
                            target.close = async function(data?:any):Promise<any>
                            {
                                return await moduleManager.close(target, data);
                            };
                            break;
                        case ModuleOpenStatus.AfterOpen:
                            // 调用onDeactivate接口
                            this.deactivateModule(fromModule, target, data);
                            // 调用onActivate接口
                            this.activateModule(target, fromModule, data);
                            // 如果replace是true，则关掉上一个模块
                            if(replace) this.close(from && from[0], data);
                            // 派发消息
                            core.dispatch(ModuleMessage.MODULE_CHANGE, cls, fromModule);
                            // 结束一次模块开启
                            await this.onFinishOpen();
                            break;
                    }
                };
                // 调用open接口
                const openData:any = await target.open(data);
                // 调用resolve
                resolve(openData);
            }
            else if(after.length > 0)
            {
                // 已经打开且不是当前模块，先关闭当前模块到目标模块之间的所有模块
                for(var i :number = 1, len:number = after.length; i < len; i++)
                {
                    this.close(after[i][0], data);
                }
                // 最后关闭当前模块，以实现从当前模块直接跳回到目标模块
                const closeData:any = await this.close(after[0][0], data);
                // 结束一次模块开启
                await this.onFinishOpen();
                // 调用resolve
                resolve(closeData);
            }
            else
            {
                // 结束一次模块开启
                await this.onFinishOpen();
                // 调用resolve
                resolve();
            }
        });
    }

    private async onFinishOpen():Promise<void>
    {
        // 关闭标识符
        this._opening = null;
        this._busy = false;
        // 如果有缓存的模块需要打开则打开之
        if(this._openCache.length > 0)
        {
            const openCache:[ModuleType, any, boolean, (data:any)=>void] = this._openCache.shift();
            const openData:any = await this.open.apply(this, openCache.slice(0, 3));
            openCache[3](openData);
        }
    }

    /**
     * 关闭模块，只有关闭的是当前模块时才会触发onDeactivate和onActivate，否则只会触发close
     * 
     * @param {ModuleType|string} clsOrName 模块类型或名称
     * @param {*} [data] 参数
     * @memberof ModuleManager
     */
    public close(module:ModuleType|string, data?:any):Promise<any>
    {
        return new Promise(async resolve=>{
            // 如果是字符串则获取引用
            var type:ModuleType = (typeof module == "string" ? getModule(module) : module) ;
            // 非空判断
            if(!type) return;
            // 数量判断，不足一个模块时不关闭
            if(this.activeCount <= 1) return;
            // 取到类型
            var cls:IMediatorConstructor = <IMediatorConstructor>getConstructor(type instanceof Function ? type : <IMediatorConstructor>type.constructor);
            // 存在性判断
            var index:number = this.getIndex(cls);
            if(index < 0) return;
            // 取到目标模块
            var moduleData:ModuleData = this._moduleStack[index];
            var target:IMediator = moduleData[1];
            // 恢复原始close方法
            var oriClose:(data?:any)=>Promise<any> = moduleData[2];
            if(oriClose) target.close = oriClose;
            else delete target.close;
            // 如果是当前模块，则需要调用onDeactivate和onActivate接口，否则不用
            let closeData:any;
            if(index == 0)
            {
                // 数据先行
                this._moduleStack.shift();
                // 获取前一个模块
                var to:ModuleData = this._moduleStack[0];
                var toModule:IMediator = to && to[1];
                // 调用onDeactivate接口
                this.deactivateModule(target, toModule, data);
                // 调用close接口
                closeData = await target.close(data);
                // 调用onActivate接口
                this.activateModule(toModule, target, data);
                // 调用onWakeUp接口
                toModule.wakeUp(target, data);
                // 派发消息
                core.dispatch(ModuleMessage.MODULE_CHANGE, to && to[0], cls);
            }
            else
            {
                // 数据先行
                this._moduleStack.splice(index, 1);
                // 调用close接口
                closeData = await target.close(data);
            }
            resolve(closeData);
        });
    }
}

type ModuleData = [IMediatorConstructor, IMediator, (data?:any)=>Promise<any>];

/** 再额外导出一个单例 */
export const moduleManager:ModuleManager = core.getInject(ModuleManager);