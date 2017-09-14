import IConstructor from "../core/interfaces/IConstructor"
import {extendsClass} from "../utils/ObjectUtil"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-13
 * @modify date 2017-09-13
 * 
 * 装饰器工具集
*/

var instanceDict:{[key:string]:((instance?:any)=>void)[]} = {};

function handleInstance(instance:any, cls:IConstructor):void
{
    var key:string = (cls || instance.constructor).toString();
    var funcs:((instance?:any)=>void)[] = instanceDict[key];
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
    // 设置toString方法
    func.toString = ()=>cls.toString();
    // 返回新的构造函数
    return func;

    function onConstruct(instance:any):void
    {
        // 恢复__proto__
        instance["__proto__"] = cls.prototype;
        // 调用父类构造函数构造实例
        cls.apply(instance, arguments);
        // 调用回调
        handleInstance(instance, cls);
    }
}

/**
 * 监听类型的实例化
 * 
 * @export
 * @param {IConstructor} cls 要监听实例化的类
 * @param {(instance?:any)=>void} handler 处理函数
 */
export function listenInstance(cls:IConstructor, handler:(instance?:any)=>void):void
{
    var key:string = cls.toString();
    var list:((instance?:any)=>void)[] = instanceDict[key];
    if(!list) instanceDict[key] = list = [];
    if(list.indexOf(handler) < 0) list.push(handler);
}