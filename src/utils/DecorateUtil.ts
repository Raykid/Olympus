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

function onInstance(cls:IConstructor, instance:any):void
{
    var key:string = cls.toString();
    var funcs:((instance?:any)=>void)[] = instanceDict[key];
    if(funcs) for(var func of funcs) func(instance);
}

/**
 * 监听实例化
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

/**
 * 在某个类型实例化时插入一个操作，该方法通常要配合类装饰器使用
 * 
 * @export
 * @param {IConstructor} cls 要监听实例化的类
 * @returns {*} 新构造函数
 */
export function delegateInstance(cls:IConstructor):any
{
    // 创建一个新的构造函数
    var func:Function;
    eval('func = function ' + cls["name"] + '(){onConstruct.call(this)}');
    // 动态设置继承
    extendsClass(func, cls);
    // 设置toString方法
    func.toString = ()=>cls.toString();
    // 返回新的构造函数
    return func;

    function onConstruct():void
    {
        // 恢复__proto__
        this["__proto__"] = cls.prototype;
        // 调用父类构造函数
        cls.apply(this, arguments);
        // 调用实例化嵌入方法
        onInstance(cls, this);
    }
}