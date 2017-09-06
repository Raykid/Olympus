import {core} from "../core/Core"
import IFrameworkView from "./IFrameworkView"
import ViewMessage from "./ViewMessage"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * View是表现层模组，用来管理所有表现层对象
*/
interface IFrameworkViewData
{
    view:IFrameworkView;
    inited:boolean;
}

@Injectable
export default class View
{
    private _viewDict:{[type:string]:IFrameworkViewData} = {};

    /**
     * 添加一个表现层实例到框架中
     * 
     * @param {IFrameworkView} view 
     * @memberof View
     */
    public addView(view:IFrameworkView):void
    {
        var type:string = view.getType();
        if(!this._viewDict[type])
        {
            var data:IFrameworkViewData = {view: view, inited: false};
            this._viewDict[type] = data;
            // 派发消息
            core.dispatch(ViewMessage.VIEW_BEFORE_INIT, view);
            // 初始化该表现层实例
            view.initView(()=>{
                // 派发消息
                core.dispatch(ViewMessage.VIEW_AFTER_INIT, view);
                // 设置初始化完毕属性
                data.inited = true;
                // 测试是否全部初始化完毕
                this.testAllInit();
            });
        }
    }

    private testAllInit():void
    {

    }
}