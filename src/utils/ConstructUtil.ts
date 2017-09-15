import IConstructor from "../core/interfaces/IConstructor"
import {extendsClass} from "../utils/ObjectUtil"
import Dictionary from "../utils/Dictionary"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-13
 * @modify date 2017-09-13
 * 
 * 装饰器工具集
*/

var instanceDict:Dictionary<IConstructor, ((instance?:any)=>void)[]> = new Dictionary();

function handleInstance(instance:any):void
{
    var cls:IConstructor = instance.constructor;
    var funcs:((instance?:any)=>void)[] = instanceDict.get(cls);
    if(funcs) for(var func of funcs) func(instance);
}

/**
 * 包装一个类型，监听类型的实例化操作
 * 
 * @export
 * @param {IConstructor} cls 要监听构造的类型构造器
 * @returns {IConstructor} 新的构造函数
 */
export function wrapConstruct(cls:IConstructor):IConstructor
{
    // 创建一个新的构造函数
    var func:IConstructor;
    eval('func = function ' + cls["name"] + '(){onConstruct(this)}');
    // 动态设置继承
    extendsClass(func, cls);
    // 为新的构造函数打一个标签，用以记录原始的构造函数
    func["__ori_constructor__"] = cls;
    // 返回新的构造函数
    return func;

    function onConstruct(instance:any):void
    {
        // 恢复__proto__
        instance["__proto__"] = cls.prototype;
        // 调用父类构造函数构造实例
        cls.apply(instance, arguments);
        // 调用回调
        handleInstance(instance);
    }
}

/**
 * 监听类型的实例化
 * 
 * @export
 * @param {IConstructor} cls 要监听实例化的类
 * @param {(instance?:any)=>void} handler 处理函数
 */
export function listenConstruct(cls:IConstructor, handler:(instance?:any)=>void):void
{
    var list:((instance?:any)=>void)[] = instanceDict.get(cls);
    if(!list) instanceDict.set(cls, list = []);
    if(list.indexOf(handler) < 0) list.push(handler);
}

/**
 * 移除实例化监听
 * 
 * @export
 * @param {IConstructor} cls 要移除监听实例化的类
 * @param {(instance?:any)=>void} handler 处理函数
 */
export function unlistenConstruct(cls:IConstructor, handler:(instance?:any)=>void):void
{
    var list:((instance?:any)=>void)[] = instanceDict.get(cls);
    if(list)
    {
        var index:number = list.indexOf(handler);
        if(index >= 0) list.splice(index, 1);
    }
}

/**
 * 监听类型销毁（如果能够销毁的话，需要类型具有dispose方法），该监听不需要移除
 * 
 * @export
 * @param {IConstructor} cls 要监听销毁的类
 * @param {(instance?:any)=>void} handler 处理函数
 */
export function listenDispose(cls:IConstructor, handler:(instance?:any)=>void):void
{
    var dispose:Function = cls.prototype.dispose;
    // 判断类型是否具有dispose方法
    if(dispose)
    {
        // 替换dispose方法
        cls.prototype.dispose = function():any
        {
            // 调用回调
            handler(this);
            // 调用原始dispose方法执行销毁
            return dispose.apply(this, arguments);
        };
    }
}