import DataType from "./DataType";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-09
 * @modify date 2017-10-09
 * 
 * 网络工具集，框架内部使用
*/
function handleObj(obj:any):any
{
    if(!obj) return obj;
    else if(obj instanceof Array) return packArray(obj);
    else if(obj.pack instanceof Function) return obj.pack();
    else if(typeof obj == "object") return packMap(obj);
    else return obj;
}

export function packArray(arr:any[]):any[]
{
    if(arr == null) return null;
    var result:Array<any> = arr.map(handleObj);
    return result;
}

export function parseArray(arr:any[], cls?:DataTypeClass):any[]
{
    if(arr == null) return [];
    // 不支持二维数组嵌套
    var result:Array<any> = [];
    for(var i:number = 0, len:number = arr.length; i < len; i++)
    {
        var value:any = arr[i];
        if (cls == null)
        {
            // 子对象是个基础类型
            result.push(value);
        }
        else
        {
            // 子对象是个自定义类型
            result.push(new cls().parse(value));
        }
    }
    return result;
}

export function packMap(map:{[key:string]:any}):{[key:string]:any}
{
    if(map == null) return null;
    var result:{[key:string]:any} = {};
    for(var key in map)
    {
        var obj:any = map[key];
        result[key] = handleObj(obj);
    }
    return result;
}

export function parseMap(map:{[key:string]:any}, cls?:DataTypeClass):{[key:string]:any}
{
    if(map == null) return {};
    // 不支持二维数组嵌套
    var result:{[key:string]:any} = {};
    for(var key in map)
    {
        var value:any = map[key];
        if (cls == null)
        {
            // 子对象是个基础类型
            result[key] = value;
        }
        else
        {
            // 子对象是个自定义类型
            result[key] = new cls().parse(value);
        }
    }
    return result;
}

export interface DataTypeClass
{
    new():DataType;
}