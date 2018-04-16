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
var hasProxy = (window["Proxy"] && Proxy.revocable instanceof Function);
var instanceDict = new Dictionary();
function handleInstance(instance) {
    var cls = instance.constructor;
    cls = cls["__ori_constructor__"] || cls;
    var funcs = instanceDict.get(cls);
    if (funcs)
        for (var _i = 0, funcs_1 = funcs; _i < funcs_1.length; _i++) {
            var func = funcs_1[_i];
            func(instance);
        }
}
/**
 * 包装一个类型，监听类型的实例化操作
 *
 * @export
 * @param {IConstructor} cls 要监听构造的类型构造器
 * @returns {IConstructor} 新的构造函数
 */
export function wrapConstruct(cls) {
    if (hasProxy) {
        // 使用Proxy监听类型构建
        return new Proxy(cls, {
            construct: function (target, args, newTarget) {
                var result = Reflect.construct(target, args, newTarget);
                if (newTarget)
                    result.constructor = newTarget;
                handleInstance(result);
                return result;
            }
        });
    }
    else {
        // 创建一个新的构造函数
        var func;
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
    function onConstruct(args) {
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
export function getConstructor(cls) {
    return (cls["__wrap_constructor__"] || cls);
}
/**
 * 监听类型的实例化
 *
 * @export
 * @param {IConstructor} cls 要监听实例化的类
 * @param {(instance?:any)=>void} handler 处理函数
 */
export function listenConstruct(cls, handler) {
    cls = cls["__ori_constructor__"] || cls;
    var list = instanceDict.get(cls);
    if (!list)
        instanceDict.set(cls, list = []);
    if (list.indexOf(handler) < 0)
        list.push(handler);
}
/**
 * 移除实例化监听
 *
 * @export
 * @param {IConstructor} cls 要移除监听实例化的类
 * @param {(instance?:any)=>void} handler 处理函数
 */
export function unlistenConstruct(cls, handler) {
    cls = cls["__ori_constructor__"] || cls;
    var list = instanceDict.get(cls);
    if (list) {
        var index = list.indexOf(handler);
        if (index >= 0)
            list.splice(index, 1);
    }
}
/**
 * 监听类型销毁（如果能够销毁的话，需要类型具有dispose方法），该监听不需要移除
 *
 * @export
 * @param {IConstructor} cls 要监听销毁的类
 * @param {(instance?:any)=>void} handler 处理函数
 */
export function listenDispose(cls, handler) {
    var dispose = cls.prototype.dispose;
    // 判断类型是否具有dispose方法
    if (dispose) {
        // 替换dispose方法
        cls.prototype.dispose = function () {
            // 调用回调
            handler(this);
            // 调用原始dispose方法执行销毁
            return dispose.apply(this, arguments);
        };
    }
}
/**
 * 监听Mediator的onOpen方法
 *
 * @export
 * @param {IConstructor} target 要监听的Mediator类型或实例
 * @param {(mediator:IMediator)=>void} [before] onOpen执行前调用的回调
 * @param {(mediator:IMediator)=>void} [after] onOpen执行后调用的回调
 */
export function listenOnOpen(target, before, after) {
    if (target instanceof Function)
        listenConstruct(target, onGetMediator);
    else
        onGetMediator(target);
    function onGetMediator(mediator) {
        // 篡改onOpen方法
        var oriFunc = mediator.hasOwnProperty("onOpen") ? mediator.onOpen : null;
        mediator.onOpen = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // 调用回调
            before && before(mediator);
            // 恢复原始方法
            if (oriFunc)
                mediator.onOpen = oriFunc;
            else
                delete mediator.onOpen;
            // 调用原始方法
            var result = mediator.onOpen.apply(this, args);
            // 调用回调
            after && after(mediator);
            return result;
        };
    }
}
