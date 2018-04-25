import IConstructor from "../core/interfaces/IConstructor";
import Dictionary from "../utils/Dictionary";
import { extendsClass } from "../utils/ObjectUtil";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-13
 * @modify date 2017-09-13
 * 
 * 装饰器工具集
*/

// 用来判断是否支持Proxy
var hasProxy:boolean = false;(window["Proxy"] && Proxy.revocable instanceof Function);

var instanceDict:Dictionary<IConstructor, ((instance?:any)=>void)[]> = new Dictionary();

function handleInstance(instance:any):void
{
    var cls:IConstructor = instance.constructor;
    cls = cls["__ori_constructor__"] || cls;
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
    if(hasProxy)
    {
        // 使用Proxy监听类型构建
        return new Proxy(cls, {
            construct: function(target:any, args:any, newTarget?:any):any
            {
                var result:any = Reflect.construct(target, args, newTarget);
                if(newTarget) result.constructor = newTarget;
                handleInstance(result);
                return result;
            }
        });
    }
    else
    {
        // 创建一个新的构造函数
        var func:IConstructor;
        eval('func = function ' + cls["name"] + '(){onConstruct.call(this, arguments)}');
        // 动态设置继承
        extendsClass(func, cls);
        // 为新的构造函数打一个标签，用以记录原始的构造函数
        func["__ori_constructor__"] = cls;
        // 为原始构造函数也打一个标签，用以记录新构造函数
        cls["__wrap_constructor__"] = func;
        // 返回新的构造函数
        return func;
    }

    function onConstruct(args:any[]):void
    {
        // 恢复__proto__
        Object.defineProperty(this, "__proto__", {
            configurable: true,
            enumerable: false,
            writable: true,
            value: cls.prototype
        });
        // 调用父类构造函数构造实例
        cls.apply(this, args);
        // 调用回调
        handleInstance(this);
    }
}

/**
 * 如果传入的类有包装类，则返回包装类，否则返回其本身
 * 
 * @export
 * @param {IConstructor} cls 要获取包装类的类构造函数
 * @returns {IConstructor} 
 */
export function getConstructor(cls:IConstructor):IConstructor
{
    return (cls["__wrap_constructor__"] || cls);
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
    cls = cls["__ori_constructor__"] || cls;
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
    cls = cls["__ori_constructor__"] || cls;
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

/**
 * 监听某个实例的某个方法调用，并插入逻辑
 * 
 * @export
 * @param {IConstructor|any} target 要监听的对象类型或实例
 * @param {string} name 要监听调用的方法名
 * @param {(instance:any, args?:any[])=>any[]|void} [before] 执行前调用的回调，如果有返回值则替换掉正式方法执行时的参数
 * @param {(instance:any, args?:any[], result?:any)=>any} [after] 执行后调用的回调，可以接收正式方法的返回值，如果after有返回值则替换掉正式方法的返回值
 * @param {boolean} [once=true] 是否是一次性监听，默认是true
 */
export function listenApply(target:IConstructor|any, name:string, before?:(instance:any, args?:any[])=>any[]|void, after?:(instance:any, args?:any[], result?:any)=>any, once:boolean=true):void
{
    if(target instanceof Function)
        // 是个类型，监听构建后再执行处理
        listenConstruct(target, onGetInstance);
    else
        // 是个实例，直接执行处理
        onGetInstance(target);

    function onGetInstance(instance:any):void
    {
        // 篡改指定方法
        var oriFunc:any = instance.hasOwnProperty(name) ? instance[name] : null;
        instance[name] = function(...args:any[]):any
        {
            // 调用回调
            var tempArgs:any[]|void = before && before(instance, args);
            // 替换参数
            if(tempArgs) args = tempArgs;
            // 如果是一次性监听，则恢复原始方法
            if(once)
            {
                if(oriFunc) instance[name] = oriFunc;
                else delete instance[name];
            }
            // 调用原始方法
            var result:any = instance[name].apply(this, args);
            // 调用回调
            var tempResult:any = after && after(instance, args, result);
            // 替换结果
            if(tempResult) result = tempResult;
            // 返回结果
            return result;
        };
    }
}