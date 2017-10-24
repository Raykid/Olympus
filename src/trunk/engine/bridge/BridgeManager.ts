import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
import IBridge from "./IBridge";
import BridgeMessage from "./BridgeMessage";
import { panelManager } from "../panel/PanelManager";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 用来管理所有表现层对象
*/
@Injectable
export default class BridgeManager
{
    private _bridgeDict:{[type:string]:[IBridge, boolean]} = {};

    /**
     * 获取表现层桥实例
     * 
     * @param {string} type 表现层类型
     * @returns {IBridge} 表现层桥实例
     * @memberof BridgeManager
     */
    public getBridge(type:string):IBridge
    {
        var data:[IBridge, boolean] = this._bridgeDict[type];
        return (data && data[0]);
    }

    /**
     * 通过给出一个显示对象皮肤实例来获取合适的表现层桥实例
     * 
     * @param {*} skin 皮肤实例
     * @returns {IBridge|null} 皮肤所属表现层桥实例
     * @memberof BridgeManager
     */
    public getBridgeBySkin(skin:any):IBridge|null
    {
        if(skin)
        {
            // 遍历所有已注册的表现层桥进行判断
            for(var type in this._bridgeDict)
            {
                var bridge:IBridge = this._bridgeDict[type][0];
                if(bridge.isMySkin(skin)) return bridge;
            }
        }
        return null;
    }

    /**
     * 注册一个表现层桥实例到框架中
     * 
     * @param {...IBridge[]} bridges 要注册的所有表现层桥
     * @memberof BridgeManager
     */
    public registerBridge(...bridges:IBridge[]):void
    {
        // 进行DOM初始化判断
        if(!document.body)
        {
            var onLoad:(evt:Event)=>void = (evt:Event)=>
            {
                window.removeEventListener("load", onLoad);
                // 重新调用注册方法
                this.registerBridge(...bridges);
            };
            window.addEventListener("load", onLoad);
            return;
        }
        // 进行初始化
        if(bridges.length > 0)
        {
            var self:BridgeManager = this;
            // 记录
            for(var bridge of bridges)
            {
                var type:string = bridge.type;
                if(!this._bridgeDict[type])
                {
                    var data:[IBridge, boolean] = [bridge, false];
                    this._bridgeDict[type] = data;
                }
            }
            // 开始初始化
            for(var bridge of bridges)
            {
                // 派发消息
                core.dispatch(BridgeMessage.BRIDGE_BEFORE_INIT, bridge);
                // 注册通用提示框
                panelManager.registerPrompt(bridge.type, bridge.promptClass);
                // 初始化该表现层实例
                if(bridge.init) bridge.init(afterInitBridge);
                else afterInitBridge(bridge);
            }
        }
        else
        {
            this.testAllInit();
        }

        function afterInitBridge(bridge:IBridge):void
        {
            // 先隐藏表现层桥的htmlWrapper
            bridge.htmlWrapper.style.display = "none";
            // 派发消息
            core.dispatch(BridgeMessage.BRIDGE_AFTER_INIT, bridge);
            // 设置初始化完毕属性
            var data:[IBridge, boolean] = self._bridgeDict[bridge.type];
            data[1] = true;
            // 测试是否全部初始化完毕
            self.testAllInit();
        }
    }

    private testAllInit():void
    {
        var allInited:boolean = true;
        for(var key in this._bridgeDict)
        {
            var data:[IBridge, boolean] = this._bridgeDict[key];
            allInited = allInited && data[1];
        }
        if(allInited) core.dispatch(BridgeMessage.BRIDGE_ALL_INIT);
    }
}
/** 再额外导出一个单例 */
export const bridgeManager:BridgeManager = core.getInject(BridgeManager);