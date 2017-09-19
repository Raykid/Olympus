/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-08-31
 * @modify date 2017-08-31
 * 
 * 这是表现层桥接口，不同渲染引擎的表现层都需要实现该接口以接入Olympus框架
*/
export default interface IBridge
{
    /**
     * 获取表现层类型名称
     * 
     * @readonly
     * @type {string}
     * @memberof IBridge
     */
    readonly type:string;
    /**
     * 获取表现层HTML包装器，可以对其样式进行自定义调整
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof IBridge
     */
    readonly htmlWrapper:HTMLElement;
    /**
     * 判断传入的skin是否是属于该表现层桥的
     * 
     * @param {*} skin 皮肤实例
     * @return {boolean} 是否数据该表现层桥
     * @memberof IBridge
     */
    isMySkin(skin:any):boolean;
    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     * 
     * @param {*} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof IBridge
     */
    mapListener(target:any, type:string, handler:Function, thisArg?:any):void;
    /**
     * 注销监听事件
     * 
     * @param {*} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof IBridge
     */
    unmapListener(target:any, type:string, handler:Function, thisArg?:any):void;
    /**
     * 初始化表现层桥，可以没有该方法，没有该方法则表示该表现层无需初始化
     * 
     * @param {()=>void} complete 初始化完毕后的回调
     * @memberof IBridge
     */
    init?(complete:(bridge:IBridge)=>void):void;
}