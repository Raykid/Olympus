import { getObjectHashs, cloneObject } from "../../utils/ObjectUtil";
import Dep from "./Dep";
import Watcher from "./Watcher";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-06
 * @modify date 2017-11-06
 * 
 * 变异器，将ViewModel变异为具有依赖功能的形式，也可以认为是编译过程
*/
// 记录数组中会造成数据更新的所有方法名
var arrMethods:string[] = [
    "push",
    "pop",
    "unshift",
    "shift",
    "splice",
    "sort",
    "reverse"
];

// 用来判断是否支持Proxy
var hasProxy:boolean = false;//(window["Proxy"] && Proxy.revocable instanceof Function);

/**
 * 将用户传进来的数据“变异”成为具有截获数据变更能力的数据
 * @param data 原始数据
 * @returns {any} 变异后的数据
 */
export function mutate(data:any):any
{
    // 如果是简单类型，则啥也不做
    if(!data || typeof data != "object") return data;
    // 判断是否支持Proxy
    if(hasProxy)
    {
        // 支持Proxy，使用Proxy整体变异对象。原理是将data的复制品打包成一个Proxy，然后设置为data的原型，以此监控data上所有取值和赋值操作
        var lock:boolean = false;
        // 产生一个data的浅表拷贝对象
        var temp:any = cloneObject(data);
        // 用temp生成一个proxy对象
        var proxy = new Proxy(temp, {
            get: function(target:any, key:PropertyKey):any
            {
                // 获取时如果没这个key则不作处理
                if(!(key in target)) return undefined;
                // 从temp中获取结果
                var result:any = Reflect.get(target, key, temp);
                // 如果被锁住了，则直接返回结果
                if(lock) return result;
                // 如果属性不是可遍历的则也直接返回结果
                var desc:PropertyDescriptor = Object.getOwnPropertyDescriptor(target, key);
                if(!desc || !desc.enumerable) return result;
                // 获取依赖key
                lock = true;
                var depKey:string = getObjectHashs(data, key);
                lock = false;
                // 对每个复杂类型对象都要有一个对应的依赖列表
                var dep:Dep = data[depKey];
                var mutateSub:boolean = (dep == null);
                if(!dep)
                {
                    dep = new Dep();
                    // 打一个标记表示已经变异过了
                    Object.defineProperty(data, depKey, {
                        value: dep,
                        writable: false,
                        enumerable: false,
                        configurable: false
                    });
                }
                // 执行处理
                onGet(dep, result, mutateSub);
                // 返回结果
                return result;
            },
            set: function(target:any, key:PropertyKey, value:any):boolean
            {
                // 设置结果
                Reflect.set(target, key, value, temp);
                // 获取依赖key
                var depKey:string = getObjectHashs(data, key);
                // 对每个复杂类型对象都要有一个对应的依赖列表
                var dep:Dep = data[depKey];
                if(!dep)
                {
                    dep = new Dep();
                    // 打一个标记表示已经变异过了
                    Object.defineProperty(data, depKey, {
                        value: dep,
                        writable: false,
                        enumerable: false,
                        configurable: false
                    });
                }
                // 执行处理
                onSet(dep, value);
                // 返回
                return true;
            }
        });
        // 清空data
        for(var key in data)
        {
            delete data[key];
        }
        // 将proxy设置为data的原型对象
        Object.setPrototypeOf(data, proxy);
    }
    else
    {
        // 递归变异所有内部变量，及其__proto__下的属性，因为getter/setter会被定义在__proto__上，而不是当前对象上
        var keys:string[] = Object.keys(data).concat(Object.keys(data.__proto__ || {}));
        // 去重
        var temp:any = {};
        for(var key of keys)
        {
            if(!temp[key])
            {
                temp[key] = key;
                mutateObject(data, key);
            }
        }
    }
    return data;
}

function onGet(dep:Dep, result:any, mutateSub:boolean):void
{
    // 如果Watcher.updating不是null，说明当前正在执行表达式，那么获取的变量自然是其需要依赖的
    var watcher:Watcher = Watcher.updating;
    if(watcher) dep.watch(watcher);
    // 首次获取需要变异
    if(mutateSub)
    {
        // 如果是数组就走专门的数组变异方法，否则递归变异对象
        if(Array.isArray(result)) mutateArray(result, dep);
        else mutate(result);
    }
}

function onSet(dep:Dep, value:any):void
{
    // 如果是数组就走专门的数组变异方法，否则递归变异对象
    if(Array.isArray(value)) mutateArray(value, dep);
    else mutate(value);
    // 触发通知
    dep.notify();
}

function mutateObject(data:any, key:string):void
{
    var depKey:string = getObjectHashs(data, key);
    // 对每个复杂类型对象都要有一个对应的依赖列表
    var dep:Dep = data[depKey];
    var mutateSub:boolean = true;
    if(!dep)
    {
        dep = new Dep();
        // 判断本来这个属性是值属性还是getter/setter属性，要有不同的操作方式
        var desc:PropertyDescriptor = Object.getOwnPropertyDescriptor(data, key) || Object.getOwnPropertyDescriptor(data.__proto__ || {}, key);
        if(desc)
        {
            // 开始变异当前属性
            if(desc.hasOwnProperty("value"))
            {
                // 值属性的变异过程
                Object.defineProperty(data, key, {
                    enumerable: true,
                    configurable: true,
                    get: ()=>{
                        // 利用闭包保存原始值
                        var result:any = desc.value;
                        // 执行处理
                        onGet(dep, result, mutateSub);
                        // 设置标记
                        mutateSub = false;
                        // 返回值
                        return result;
                    },
                    set: value=>{
                        if(!desc.writable || value === desc.value) return;
                        desc.value = value;
                        // 执行处理
                        onSet(dep, value);
                    }
                });
            }
            else
            {
                // getter/setter属性的变异过程
                Object.defineProperty(data, key, {
                    enumerable: true,
                    configurable: false,
                    get: ()=>{
                        if(!desc.get) return;
                        // 获取get方法结果
                        var result:any = desc.get.call(data);
                        // 执行处理
                        onGet(dep, result, mutateSub);
                        // 设置标记
                        mutateSub = false;
                        // 返回值
                        return result;
                    },
                    set: value=>{
                        if(!desc.set) return;
                        // 设置
                        desc.set.call(data, value);
                        // 执行处理
                        onSet(dep, value);
                    }
                });
            }
        }
        // 打一个标记表示已经变异过了
        Object.defineProperty(data, depKey, {
            value: dep,
            writable: false,
            enumerable: false,
            configurable: false
        });
    }
}

function mutateArray(arr:any[], dep:Dep):void
{
    // 变异当前数组
    Object.defineProperty(arr, "__proto__", {
        configurable: true,
        enumerable: false,
        writable: true,
        value: defineReactiveArray(dep)
    });
    // 遍历当前数组，将内容对象全部变异
    for(var i:number = 0, len:number = arr.length; i < len; i++)
    {
        mutate(arr[i]);
    }
}

function defineReactiveArray(dep:Dep):any[]
{
    var proto:any[] = Array.prototype;
    var result:any[] = Object.create(proto);
    // 遍历所有方法，一个一个地变异
    arrMethods.forEach((method:string)=>{
        // 利用闭包记录一个原始方法
        var oriMethod:Function = proto[method];
        // 开始变异
        Object.defineProperty(result, method, {
            value: function(...args:any[]):any
            {
                // 首先调用原始方法，获取返回值
                var result:any = oriMethod.apply(this, args);
                // 数组插入项
                var inserted:any[];
                switch(method)
                {
                    case "push":
                    case "unshift":
                        inserted = args;
                        break
                    case "splice":
                        inserted = args.slice(2);
                        break
                }
                // 监视数组插入项，而不是重新监视整个数组
                if(inserted && inserted.length)
                {
                    mutateArray(inserted, dep);
                }
                // 触发更新
                dep.notify({method: args});
                // 返回值
                return result;
            }
        });
    });
    // 提供替换数组设置的方法，因为直接设置数组下标的方式无法变异
    Object.defineProperty(result, "$set", {
        value: function(index:number, value:any):any
        {
            // 超出数组长度默认追加到最后
            if(index >= this.length) index = this.length;
            return this.splice(index, 1, value)[0];
        }
    });
    // 提供替换数组移除的方法，因为直接移除的方式无法变异
    Object.defineProperty(result, "$remove", {
        value: function(item:any):any
        {
            var index = this.indexOf(item);
            if(index > -1) return this.splice(index, 1);
            return null;
        }
    });
    return result;
}