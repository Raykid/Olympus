import Dictionary from '../../utils/Dictionary';
import { replaceDisplay } from '../../utils/DisplayUtil';
import { extendObject, getObjectHashs } from "../../utils/ObjectUtil";
import IBridge from '../interfaces/IBridge';
import IComponent from '../interfaces/IComponent';
import IComponentConstructor from '../interfaces/IComponentConstructor';
import Bind from './Bind';
import { IWatcher } from './Watcher';

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-06
 * @modify date 2017-11-06
 * 
 * 绑定工具类
*/

export interface EvalFunc
{
    (...scopes:any[]):any;
}

export type EvalExp = string | EvalFunc;

function wrapEvalFunc(exp:EvalFunc):EvalFunc
{
    // 这个方法的功能主要是将多个scope合并成为一个scope
    return function(...scopes:any[]):any
    {
        var scope:any = extendObject({}, ...scopes.reverse());
        return exp.call(this, scope);
    };
}

/**
 * 将表达式包装成为方法
 * 
 * @param {(EvalExp)} exp 表达式或方法
 * @param {number} scopeCount 参数个数，仅在exp为表达式时有效
 * @returns {EvalFunc} 包装方法
 */
function wrapEvalFuncExp(exp:EvalExp, scopeCount:number):EvalFunc
{
    if(typeof exp === "string")
    {
        var argList:string[] = [];
        var expStr:string = exp;
        for(var i:number = 0; i < scopeCount; i++)
        {
            argList.push("s" + i);
            expStr = "with(s" + i + "||{}){" + expStr + "}";
        }
        return Function(argList.join(","), expStr) as EvalFunc;
    }
    else
    {
        return wrapEvalFunc(exp);
    }
}

/**
 * 创建一个执行方法，用于未来执行
 * 
 * @export
 * @param {(EvalExp)} exp 表达式或方法
 * @param {number} [scopeCount=0] 所需的域的数量
 * @returns {EvalFunc} 创建的方法
 */
export function createRunFunc(exp:EvalExp, scopeCount:number=0):EvalFunc
{
    if(typeof exp === "string")
    {
        var func:EvalFunc;
        try
        {
            func = wrapEvalFuncExp(exp, scopeCount);
        }
        catch(err)
        {
            // 可能是某些版本的解释器不认识模板字符串，将模板字符串变成普通字符串
            var sepStr:string = (exp.indexOf('"') < 0 ? '"' : "'");
            // 将exp中的·替换为'
            var reg:RegExp = /([^\\]?)`/g;
            exp = exp.replace(reg, "$1" + sepStr);
            // 将exp中${...}替换为" + ... + "的形式
            reg = /\$\{(.*?)\}/g;
            exp = exp.replace(reg, sepStr + "+($1)+" + sepStr);
            // 重新生成方法并返回
            func = wrapEvalFuncExp(exp, scopeCount);
        }
        return func;
    }
    else
    {
        return wrapEvalFunc(exp);
    }
}

/**
 * 直接执行表达式，不求值。该方法可以执行多条语句
 * 
 * @export
 * @param {(EvalExp)} exp 表达式或方法
 * @param {*} [thisArg] this指向
 * @param {...any[]} scopes 表达式的作用域列表
 */
export function runExp(exp:EvalExp, thisArg?:any, ...scopes:any[]):void
{
    createRunFunc(exp, scopes.length).apply(thisArg, scopes);
}

/**
 * 创建一个表达式求值方法，用于未来执行
 * 
 * @export
 * @param {(EvalExp)} exp 表达式或方法
 * @param {number} [scopeCount=0] 所需的域的数量
 * @returns {EvalFunc} 创建的方法
 */
export function createEvalFunc(exp:EvalExp, scopeCount:number = 0):EvalFunc
{
    if(typeof exp === "string")
        return createRunFunc("return " + exp, scopeCount);
    else
        return wrapEvalFunc(exp);
}

/**
 * 表达式求值，无法执行多条语句
 * 
 * @export
 * @param {(EvalExp)} exp 表达式或方法
 * @param {*} [thisArg] this指向
 * @param {...any[]} scopes 表达式的作用域列表
 * @returns {*} 返回值
 */
export function evalExp(exp:EvalExp, thisArg?:any, ...scopes:any[]):any
{
    return createEvalFunc(exp, scopes.length).apply(thisArg, scopes);
}

export const bindDict:Dictionary<IComponent, BindData> = new Dictionary();

/**
 * 绑定数据到UI上
 * 
 * @param {IComponent} comp 组件
 * @returns {Bind} 返回绑定实例
 * @memberof BindManager
 */
export function bind(comp:IComponent):Bind
{
    var bindData:BindData = bindDict.get(comp);
    if(!bindData)
    {
        bindDict.set(comp, bindData = {
            bind: new Bind(comp),
            callbacks: []
        });
    }
    // 重新绑定所有
    for(var callback of bindData.callbacks)
    {
        callback();
    }
    // 返回Bind对象
    return bindData.bind;
}

/**
 * 移除绑定
 * 
 * @param {IComponent} comp 
 * @returns {Bind} 
 * @memberof BindManager
 */
export function unbind(comp:IComponent):Bind
{
    var bindData:BindData = bindDict.get(comp);
    if(bindData)
    {
        bindData.bind.dispose();
        bindDict.delete(comp);
    }
    return bindData && bindData.bind;
}

export interface BindData
{
    bind:Bind;
    callbacks:(()=>void)[];
}

function addBindHandler(comp:IComponent, callback:()=>void):void
{
    var handler:()=>void = ()=>{
        // 判断数据是否合法
        if(!comp.viewModel) return;
        // 开始绑定
        callback();
    };
    // 添加绑定数据
    var bindData:BindData = bindDict.get(comp);
    if(bindData.callbacks.indexOf(handler) < 0)
        bindData.callbacks.push(handler);
    // 立即调用一次
    handler();
}

function getNearestAncestor(bridge:IBridge, target:any, propName:string):any
{
    if(!target || target[propName]) return target;
    else return getNearestAncestor(bridge, bridge.getParent(target), propName);
}

/**
 * 绑定属性值
 * 
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {string} name 绑定的属性名
 * @param {(EvalExp)} exp 绑定的表达式或方法
 * @memberof BindManager
 */
export function bindValue(comp:IComponent, currentTarget:any, target:any, envModels:any[], name:string, exp:EvalExp):void
{
    var watcher:IWatcher;
    var bindData:BindData = bindDict.get(comp);
    addBindHandler(comp, ()=>{
        // 如果之前绑定过，则要先销毁之
        if(watcher) watcher.dispose();
        // 绑定新的订阅者
        watcher = bindData.bind.createWatcher(currentTarget, target, exp, (value:any)=>{
            currentTarget[name] = value;
        }, comp.viewModel, ...envModels, comp.viewModel);
    });
}

/**
 * 绑定一个表达式，与bindValue类似，但不会给属性赋值
 * 
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {(EvalExp)} exp 绑定的表达式或方法
 * @memberof BindManager
 */
export function bindExp(comp:IComponent, currentTarget:any, target:any, envModels:any[], exp:EvalExp):void
{
    var watcher:IWatcher;
    var bindData:BindData = bindDict.get(comp);
    addBindHandler(comp, ()=>{
        // 如果之前绑定过，则要先销毁之
        if(watcher) watcher.dispose();
        // 绑定新的订阅者
        watcher = bindData.bind.createWatcher(currentTarget, target, exp, (value:any)=>{
            // 不干任何事情
        }, comp.viewModel, ...envModels, comp.viewModel);
    });
}

/**
 * 绑定方法执行
 * 
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {string} name 绑定的方法名
 * @param {...(EvalExp)[]} argExps 执行方法的参数表达式或方法列表
 * @memberof BindManager
 */
export function bindFunc(comp:IComponent, currentTarget:any, target:any, envModels:any[], name:string, ...argExps:(EvalExp)[]):void
{
    var watchers:IWatcher[] = [];
    var bindData:BindData = bindDict.get(comp);
    addBindHandler(comp, ()=>{
        // 判断参数数量，无参数方法一次性执行即可，无需绑定，有参数的方法则需要每次参数改变就执行一次
        if(argExps.length > 0)
        {
            // 将表达式中所有undefined和null变为内部值
            var undefinedValue:string = Date.now() * Math.random() + "_undefined";
            var nullValue:string = Date.now() * Math.random() + "_null";
            argExps = argExps.map(exp=>{
                if(exp === undefined) return "'" + undefinedValue + "'";
                else if(exp === null) return "'" + nullValue + "'";
                else return exp;
            });
            // 绑定表达式参数数组
            var initValue:any = {};
            var args:any[] = [];
            var argsInited:boolean = false;
            var handler:(index:number, value:any)=>void = (index:number, value:any)=>{
                // 将value中的undefined和null恢复回去
                if(value === undefinedValue) value = undefined;
                else if(value == nullValue) value = null;
                // 设置参数值
                args[index] = value;
                // 判断参数是否齐全
                if(!argsInited)
                {
                    for(var arg of args)
                    {
                        // 如果列表里存在初始值，表示没有赋值完毕，直接返回
                        if(arg === initValue) return;
                    }
                    // 设置初始化完毕状态
                    argsInited = true;
                }
                // 赋值已经完毕了，调用方法，this指向ui本身
                currentTarget[name].apply(currentTarget, args);
            };
            // 清理旧的订阅者
            for(var i:number = 0, len:number = watchers.length; i < len; i++)
            {
                watchers.shift().dispose();
            }
            // 循环绑定表达式到handler
            for(var i:number = 0, len:number = argExps.length; i < len; i++)
            {
                // 记录一个初始值，用于判断参数列表是否已赋值完毕
                args.push(initValue);
            }
            for(var i:number = 0, len:number = argExps.length; i < len; i++)
            {
                // 绑定表达式
                var watcher:IWatcher = bindData.bind.createWatcher(currentTarget, target, argExps[i], handler.bind(this, i), comp.viewModel, ...envModels, comp.viewModel);
                // 记录订阅者
                watchers.push(watcher);
            }
        }
        else
        {
            // 无参数执行，无需绑定，一次性执行即可
            target[name]();
        }
    });
}

/**
 * 绑定事件
 * 
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {string} type 绑定的事件类型
 * @param {EvalExp} exp 绑定的事件回调表达式或方法
 * @memberof BindManager
 */
export function bindOn(comp:IComponent, currentTarget:any, target:any, envModels:any[], type:string, exp:EvalExp):void
{
    addBindHandler(comp, ()=>{
        var commonScope:any = {
            $this: comp,
            $data: comp.viewModel,
            $bridge: comp.bridge,
            $currentTarget: currentTarget,
            $target: target
        };
        // 计算事件hash
        var onHash:string = getObjectHashs(currentTarget, type, exp);
        // 如果之前添加过监听，则先移除之
        var handler:Function = currentTarget[onHash];
        if(handler)
        {
            comp.bridge.unmapListener(currentTarget, type, handler, comp.viewModel);
            handler = null;
        }
        // 先尝试用exp当做方法名去viewModel里寻找，如果找不到则把exp当做一个执行表达式处理，外面包一层方法
        if(typeof exp === "string") handler = comp.viewModel[exp];
        if(!(handler instanceof Function))
        {
            var func:Function = createRunFunc(exp, 3 + envModels.length);
            // 这里要转一手，记到闭包里一个副本，否则因为bindOn是延迟操作，到时envModel可能已被修改
            handler = function(event:any):void
            {
                func.call(this, commonScope, ...envModels, comp.viewModel, {$event: event});
            };
        }
        comp.bridge.mapListener(currentTarget, type, handler, comp.viewModel);
        // 将事件回调记录到显示对象上
        currentTarget[onHash] = handler;
        // 如果__bind_sub_events__列表存在，则将事件记录到其上
        var nearestAncestor:any = getNearestAncestor(comp.bridge, target, "__bind_sub_events__");
        var events:BindEventData[] = (nearestAncestor || target).__bind_sub_events__;
        if(events)
        {
            events.push({
                target: currentTarget,
                type: type,
                handler: handler,
                thisArg: comp.viewModel
            });
        }
    });
}

/**
 * 绑定显示
 * 
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {EvalExp} exp 绑定表达式或方法
 * @param {(value:boolean)=>void} [callback] 判断条件改变时会触发这个回调
 * @memberof BindManager
 */
export function bindIf(comp:IComponent, currentTarget:any, target:any, envModels:any[], exp:EvalExp, callback?:(value:boolean)=>void):void
{
    var watcher:IWatcher;
    var bindData:BindData = bindDict.get(comp);
    var replacer:any = comp.bridge.createEmptyDisplay();
    addBindHandler(comp, ()=>{
        // 如果之前绑定过，则要先销毁之
        if(watcher) watcher.dispose();
        // 绑定表达式
        watcher = bindData.bind.createWatcher(currentTarget, target, exp, (value:boolean)=>{
            // 如果表达式为true则显示ui，否则移除ui
            if(value) replaceDisplay(comp.bridge, replacer, currentTarget);
            else replaceDisplay(comp.bridge, currentTarget, replacer);
            // 触发回调
            callback && callback(value);
        }, comp.viewModel, ...envModels, comp.viewModel);
    });
}

const _regExp:RegExp = /^\s*(\w+)\s+((in)|(of))\s+(.+?)\s*$/;
/**
 * 绑定循环
 * 
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {string} name 绑定本来所在的对象在Component中的名字
 * @param {string} exp 循环表达式，形如："a in b"（表示a遍历b中的key）或"a of b"（表示a遍历b中的值）。b可以是个表达式
 * @param {IComponentConstructor} [compCls] 提供该参数将使用提供的组件包装每一个渲染器
 * @param {IComponentConstructor} [declaredComponentCls] 声明的Component类型
 * @param {string} [dataExp] 提供给组件包装器的数据表达式
 * @param {(data:any, renderer:any, envModels:any[])=>void} [callback] 每次生成新的renderer实例时调用这个回调
 * @memberof BindManager
 */
export function bindFor(comp:IComponent, currentTarget:any, target:any, envModels:any[], name:string, exp:string, compCls?:IComponentConstructor, declaredComponentCls?:IComponentConstructor, dataExp?:string, callback?:(data:any, renderer:any, envModels:any[])=>void):void
{
    var watcher:IWatcher;
    var bindData:BindData = bindDict.get(comp);
    var subComponentCache:IComponent[] = [];
    addBindHandler(comp, ()=>{
        // 解析表达式
        var res:RegExpExecArray = _regExp.exec(exp);
        if(!res) return;
        // 如果给出了声明的Component类型，则生成一个声明Component，替换掉comp当前的皮肤
        var declaredComponent:IComponent
        if(declaredComponentCls)
        {
            declaredComponent = new declaredComponentCls(target);
            comp.delegate(declaredComponent);
            comp[name] = declaredComponent;
        }
        // 包装渲染器创建回调
        var memento:any = comp.bridge.wrapBindFor(currentTarget, (key:any, value:any, renderer:any)=>{
            // 设置环境变量
            var commonScope:any = {
                $key: key,
                $value: value,
                $parent: envModels[0] || comp.viewModel
            };
            // 填入用户声明的属性
            commonScope[res[1]] = (res[2] == "in" ? key : value);
            // 生成一个环境变量的副本
            var subEnvModels:any[] = envModels.concat();
            // 插入环境变量
            subEnvModels.unshift(commonScope);
            // 如果renderer已经有事件列表了，说明renderer是被重用的，删除所有事件
            var events:BindEventData[] = renderer.__bind_sub_events__;
            for(var i in events)
            {
                var data:BindEventData = events.pop();
                comp.bridge.unmapListener(data.target, data.type, data.handler, data.thisArg);
            }
            // 为renderer设置子对象事件列表
            if(!events) renderer.__bind_sub_events__ = [];
            // 为renderer套一个Component外壳
            if(compCls)
            {
                var subComponent:IComponent = new compCls(renderer);
                // 更新渲染器
                if(subComponent.skin && subComponent.bridge === comp.bridge)
                    renderer = subComponent.skin;
                // 托管子组件，优先托管在声明出来的中间组件上
                (declaredComponent || comp).delegate(subComponent);
                // 开启该组件，优先使用dataExp，如果没有则使用当前所有的数据
                let data:any;
                if(dataExp)
                {
                    // 有数据表达式，求出数据表达式的值来
                    data = evalExp(dataExp, comp.viewModel, ...subEnvModels.concat().reverse(), comp.viewModel);
                }
                else
                {
                    // 没有数据表达式，套用当前所在变量域，且要打平做成一个data
                    data = extendObject({}, comp.viewModel, ...subEnvModels);
                }
                subComponent.open(data);
                // 缓存子组件
                subComponentCache.push(subComponent);
            }
            // 触发回调，进行内部编译
            callback && callback(value, renderer, subEnvModels);
        });
        // 如果之前绑定过，则要先销毁之
        if(watcher) watcher.dispose();
        // 获得要遍历的数据集合
        watcher = bindData.bind.createWatcher(currentTarget, target, res[5], (datas:any)=>{
            // 如果遍历的对象是个数字，则伪造一个临时数组供使用
            if(typeof datas === "number")
            {
                var tempArr:number[] = [];
                for(var i:number = 0; i < datas; i++)
                {
                    tempArr.push(i);
                }
                datas = tempArr;
            }
            // 清空已有的子组件
            for(var i:number = 0, len:number = subComponentCache.length; i < len; i++)
            {
                var subComponent:IComponent = subComponentCache.shift();
                comp.undelegate(subComponent);
                subComponent.dispose();
            }
            // 赋值
            comp.bridge.valuateBindFor(currentTarget, datas, memento);
        }, comp.viewModel, ...envModels, comp.viewModel);
    });
}

interface BindEventData
{
    target:any;
    type:string;
    handler:Function;
    thisArg:any;
}