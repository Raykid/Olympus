import Dictionary from "../../utils/Dictionary";
import Watcher from "./Watcher";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-06
 * @modify date 2017-11-06
 * 
 * 定义一个依赖，一个观察者实现
*/
export default class Dep
{
    private _map:Dictionary<Watcher, Watcher> = new Dictionary();

    /**
     * 添加数据变更订阅者
     * @param watcher 数据变更订阅者
     */
    public watch(watcher:Watcher):void
    {
        this._map.set(watcher, watcher);
    }

    /**
     * 数据变更，通知所有订阅者
     * @param extra 可能的额外数据
     */
    public notify(extra?:any):void
    {
        this._map.forEach((watcher:Watcher)=>{
            watcher.update(extra);
        });
    }
}