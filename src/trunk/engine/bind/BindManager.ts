import { Injectable } from "../../core/injector/Injector";
import { core } from "../../core/Core";
import Dictionary from "../../utils/Dictionary";
import IMediator from "../mediator/IMediator";
import Bind from "./Bind";
import IBridge from "../bridge/IBridge";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-06
 * @modify date 2017-11-06
 * 
 * 绑定管理器，可以将数据和显示对象绑定到一起，MVVM书写界面
*/
@Injectable
export default class BindManager
{
    private _bindDict:Dictionary<IMediator, BindData> = new Dictionary();

    /**
     * 绑定数据到UI上
     * 
     * @param {IMediator} mediator 中介者
     * @returns {Bind} 返回绑定实例
     * @memberof BindManager
     */
    public bind(mediator:IMediator):Bind
    {
        var bindData:BindData = this._bindDict.get(mediator);
        if(!bindData)
        {
            this._bindDict.set(mediator, bindData = {
                bind: new Bind(mediator),
                callbacks: []
            });
        }
        // 重新绑定所有
        for(var callback of bindData.callbacks)
        {
            callback();
        }
        // 返回Bind对象
        return bindData.bind;
    }

    /**
     * 移除绑定
     * 
     * @param {IMediator} mediator 
     * @returns {Bind} 
     * @memberof BindManager
     */
    public unbind(mediator:IMediator):Bind
    {
        var bindData:BindData = this._bindDict.get(mediator);
        if(bindData) this._bindDict.delete(mediator);
        return bindData && bindData.bind;
    }
    
    private search(values:any, ui:any, callback:(ui:any, key:string, exp:string)=>void):void
    {
        for(var key in values)
        {
            var value:any = values[key];
            var index:number = key.indexOf(".");
            if(index >= 0)
            {
                // 是表达式寻址，递归寻址
                var newValue:any = {};
                newValue[key.substr(index + 1)] = value;
                this.search(newValue, ui[key.substring(0, index)], callback);
            }
            else if(typeof value != "string")
            {
                // 是子对象寻址，递归寻址
                this.search(value, ui[key], callback);
            }
            else
            {
                // 是表达式，调用回调
                callback(ui, key, value);
            }
        }
    }

    private fastSearch(mediator:IMediator, values:any, ui:any, callback:(ui:any, key:string, exp:string)=>void):void
    {
        var handler:()=>void = ()=>{
            // 判断数据是否合法
            if(!mediator.viewModel) return;
            // 开始绑定
            this.search(values, ui, callback);
        };
        // 添加绑定数据
        var bindData:BindData = this._bindDict.get(mediator);
        bindData.callbacks.push(handler);
        // 立即调用一次
        handler();
    }

    /**
     * 绑定属性值
     * 
     * @param {IMediator} mediator 中介者
     * @param {*} values 属性字典
     * @param {*} ui 绑定到的ui实体对象
     * @memberof BindManager
     */
    public bindValue(mediator:IMediator, values:any, ui:any):void
    {
        this.fastSearch(mediator, values, ui, (ui:any, key:string, exp:string)=>{
            var bindData:BindData = this._bindDict.get(mediator);
            bindData.bind.createWatcher(ui, exp, mediator.viewModel, (value:any)=>{
                ui[key] = value;
            });
        });
    }

    /**
     * 绑定事件
     * 
     * @param {IMediator} mediator 中介者
     * @param {*} values 事件字典
     * @param {*} ui 绑定到的ui实体对象
     * @memberof BindManager
     */
    public bindOn(mediator:IMediator, values:any, ui:any):void
    {
        this.fastSearch(mediator, values, ui, (ui:any, key:string, exp:string)=>{
            mediator.bridge.mapListener(ui, key, mediator.viewModel[exp], mediator.viewModel);
        });
    }

    private replaceDisplay(bridge:IBridge, ori:any, cur:any):void
    {
        var parent:any = bridge.getParent(ori);
        if(parent)
        {
            // ori有父级，记录其当前索引
            var index:number = bridge.getChildIndex(parent, ori);
            // 移除ori
            bridge.removeChild(parent, ori);
            // 显示cur
            bridge.addChildAt(parent, cur, index);
        }
    }
    
    /**
     * 绑定显示
     * 
     * @param {IMediator} mediator 中介者
     * @param {*} values 事件字典
     * @param {*} ui 绑定到的ui实体对象
     * @memberof BindManager
     */
    public bindIf(mediator:IMediator, exp:string, ui:any):void
    {
        var replacer:any = mediator.bridge.createEmptyDisplay();
        var handler:()=>void = ()=>{
            // 判断数据是否合法
            if(!mediator.viewModel) return;
            // 开始绑定
            var bindData:BindData = this._bindDict.get(mediator);
            bindData.bind.createWatcher(ui, exp, mediator.viewModel, (value:boolean)=>{
                // 如果表达式为true则显示ui，否则移除ui
                if(value) this.replaceDisplay(mediator.bridge, replacer, ui);
                else this.replaceDisplay(mediator.bridge, ui, replacer);
            });
        };
        // 添加绑定数据
        var bindData:BindData = this._bindDict.get(mediator);
        bindData.callbacks.push(handler);
        // 立即调用一次
        handler();
    }
}

interface BindData
{
    bind:Bind;
    callbacks:(()=>void)[];
}

/** 再额外导出一个单例 */
export const bindManager:BindManager = core.getInject(BindManager);