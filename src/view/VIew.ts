import {core} from "../core/Core"
import IBridge from "./bridge/IBridge"
import ViewMessage from "./messages/ViewMessage"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * View是表现层模组，用来管理所有表现层对象
*/
interface IBridgeData
{
    view:IBridge;
    inited:boolean;
}

@Injectable
export default class View
{
    private _viewDict:{[type:string]:IBridgeData} = {};

    /**
     * 注册一个表现层桥实例到框架中
     * 
     * @param {IBridge} view 
     * @memberof View
     */
    public registerBridge(view:IBridge):void
    {
        var type:string = view.getType();
        if(!this._viewDict[type])
        {
            var data:IBridgeData = {view: view, inited: false};
            this._viewDict[type] = data;
            // 派发消息
            core.dispatch(ViewMessage.VIEW_BEFORE_INIT, view);
            // 初始化该表现层实例
            var self:View = this;
            if(view.initView) view.initView(afterInitView);
            else afterInitView();
        }

        function afterInitView():void
        {
            // 派发消息
            core.dispatch(ViewMessage.VIEW_AFTER_INIT, view);
            // 设置初始化完毕属性
            data.inited = true;
            // 测试是否全部初始化完毕
            self.testAllInit();
        }
    }

    private testAllInit():void
    {

    }
}
/** 再额外导出一个单例 */
export const view:View = global.Inject.getInject(View)