import {core} from "../core/Core"
import IBridge from "./bridge/IBridge"
import ViewMessage from "./message/ViewMessage"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * View是表现层模组，用来管理所有表现层对象
*/
@Injectable
export default class View
{
    private _bridgeDict:{[type:string]:[IBridge, boolean]} = {};

    /**
     * 获取表现层桥实例
     * 
     * @param {string} type 表现层类型
     * @returns {IBridge} 表现层桥实例
     * @memberof View
     */
    public getBridge(type:string):IBridge
    {
        var data:[IBridge, boolean] = this._bridgeDict[type];
        return (data && data[0]);
    }

    /**
     * 注册一个表现层桥实例到框架中
     * 
     * @param {...IBridge[]} bridges 要注册的所有表现层桥
     * @memberof View
     */
    public registerBridge(...bridges:IBridge[]):void
    {
        if(bridges.length > 0)
        {
            var self:View = this;
            for(var bridge of bridges)
            {
                var type:string = bridge.getType();
                if(!this._bridgeDict[type])
                {
                    var data:[IBridge, boolean] = [bridge, false];
                    this._bridgeDict[type] = data;
                    // 派发消息
                    core.dispatch(ViewMessage.BRIDGE_BEFORE_INIT, bridge);
                    // 初始化该表现层实例
                    if(bridge.init) bridge.init(afterInitBridge);
                    else afterInitBridge();
                }
            }
        }
        else
        {
            this.testAllInit();
        }

        function afterInitBridge():void
        {
            // 派发消息
            core.dispatch(ViewMessage.BRIDGE_AFTER_INIT, bridge);
            // 设置初始化完毕属性
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
        if(allInited) core.dispatch(ViewMessage.BRIDGE_ALL_INIT);
    }
}
/** 再额外导出一个单例 */
export const view:View = core.getInject(View)