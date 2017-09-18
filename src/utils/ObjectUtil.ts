/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-11
 * @modify date 2017-09-11
 * 
 * 对象工具集
*/

/**
 * populate properties
 * @param target        目标obj
 * @param sources       来源obj
 */
export function extendObject(target:any, ...sources:any[]):any
{
    sources.forEach(function (source: Object): void
    {
        if (!source) return;
        for (let propName in source)
        {
            if (source.hasOwnProperty(propName))
            {
                target[propName] = source[propName];
            }
        }
    });
    return target;
}

/**
 * 复制对象
 * @param target 要复制的对象
 * @param deep 是否深表复制，默认浅表复制
 * @returns {any} 复制后的对象
 */
export function cloneObject(target:any, deep:boolean=false):any
{
    if(target == null) return null;
    var newObject:any = {};
    for(var key in target)
    {
        var value:any = target[key];
        if(deep && typeof value == "object")
        {
            // 如果是深表复制，则需要递归复制子对象
            value = cloneObject(value, true);
        }
        newObject[key] = value;
    }
    return newObject;
}

/**
 * 生成一个随机ID
 */
export function getGUID(): string
{
    let s: string[] = [];
    let hexDigits: string = "0123456789abcdef";
    for (let i: number = 0; i < 36; i++)
    {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((parseInt(s[19]) & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    return s.join("");
}

var _getAutoIncIdMap:{[type:string]:number} = {};
/**
 * 生成自增id（从0开始）
 * @param type
 */
export function getAutoIncId(type: string): string
{
    var index: number = _getAutoIncIdMap[type] || 0;
    _getAutoIncIdMap[type] = index++;
    return type + "-" + index;
}

/**
 * 判断对象是否为null或者空对象
 * @param obj 要判断的对象
 * @returns {boolean} 是否为null或者空对象
 */
export function isEmpty(obj:any):boolean
{
    var result:boolean = true;
    for(var key in obj)
    {
        result = false;
        break;
    }
    return result;
}

/**
 * 移除data中包含的空引用或未定义
 * @param data 要被移除空引用或未定义的对象
 */
export function trimData(data:any):any
{
    for(var key in data)
    {
        if(data[key] == null)
        {
            delete data[key];
        }
    }
    return data;
}

/**
 * 让child类继承自parent类
 * @param child 子类
 * @param parent 父类
 */
export var extendsClass:(child:any, parent:any)=>void = (function () {
    var extendStatics = Object["setPrototypeOf"] ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var hash:number = 0;
var hashTypes:string[] = ["object", "function"];
/**
 * 获取一个对象的对象哈希字符串
 * 
 * @export
 * @param {*} target 任意对象，可以是基础类型或null
 * @returns {string} 哈希值
 */
export function getObjectHash(target:any):string
{
    if(target == null) return "__object_hash_0__";
    var key:string = "__object_hash__";
    var value:string = target[key];
    // 如果已经有哈希值则直接返回
    if(value) return value;
    // 如果是基础类型则直接返回对应字符串
    var type:string = typeof target;
    if(hashTypes.indexOf(type) < 0) return type + ":" + target;
    // 如果是复杂类型则返回计算的哈希值并打上标签
    return (target[key] = "__object_hash_" + (++hash) + "__");
}