import IBridge from "../../trunk/view/bridge/IBridge";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * Egret的表现层桥实现
*/
export default class Bridge implements IBridge
{
    public constructor()
    {
    }

    /**
     * 获取表现层类型名称
     * @return {string} 一个字符串，代表表现层类型名称
     * @memberof IBridge
     */
    public getType():string
    {
        return "Egret"
    }

    /**
     * 获取表现层HTML包装器，可以对其样式进行自定义调整
     * @return {HTMLElement} 表现层的HTML包装器，通常会是一个<div/>标签
     * @memberof IBridge
     */
    public getHTMLWrapper():HTMLElement
    {

    }
    
    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     * 
     * @param {*} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof IBridge
     */
    public mapListener(target:any, type:string, handler:Function, thisArg?:any):void
    {
        
    }
    
    /**
     * 注销监听事件
     * 
     * @param {*} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof IBridge
     */
    public unmapListener(target:any, type:string, handler:Function, thisArg?:any):void
    {

    }
    
    /**
     * 初始化表现层桥，可以没有该方法，没有该方法则表示该表现层无需初始化
     * @param {()=>void} complete 初始化完毕后的回调
     * @memberof IBridge
     */
    public init?(complete:(bridge:IBridge)=>void):void
    {

    }
}