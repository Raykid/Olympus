import "reflect-metadata";
import { listenApply, listenConstruct, listenDispose, wrapConstruct } from "../../utils/ConstructUtil";
import Dictionary from "../../utils/Dictionary";
import { replaceDisplay } from "../../utils/DisplayUtil";
import { evalExp, EvalExp } from '../bind/Utils';
import ComponentStatus from '../enums/ComponentStatus';
import { decorateThis } from '../global/Patch';
import IBridge from '../interfaces/IBridge';
import IComponent from '../interfaces/IComponent';
import IComponentConstructor from '../interfaces/IComponentConstructor';
import * as BindUtil from "./BindUtil";
import { searchUI } from "./BindUtil";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-19
 * @modify date 2017-09-19
 * 
 * 负责注入的模块
*/

var subHandlerDict:Dictionary<IComponent, ((instance:IComponent)=>void)[]> = new Dictionary();
export function addSubHandler(instance:IComponent, handler:(instance?:IComponent)=>void):void
{
    if(!instance) return;
    var handlers:((instance:IComponent)=>void)[] = subHandlerDict.get(instance);
    if(!handlers) subHandlerDict.set(instance, handlers = []);
    if(handlers.indexOf(handler) < 0) handlers.push(handler);
}

export function isComponent(target:any):boolean
{
    return (target.delegate instanceof Function && target.undelegate instanceof Function);
}

/** 定义组件，支持数据绑定功能 */
export function ComponentClass():ClassDecorator
{
    return function(cls:IConstructor):IConstructor
    {
        // 判断一下Component是否有dispose方法，没有的话弹一个警告
        if(!cls.prototype.dispose)
            console.warn("Component[" + cls["name"] + "]不具有dispose方法，可能会造成内存问题，请让该Mediator实现IDisposable接口");
        // 监听实例化
        listenConstruct(cls, function(instance:IComponent):void
        {
            // 替换skin属性
            var $skin:any;
            var oriSkin = instance.skin;
            Object.defineProperty(instance, "skin", {
                configurable: true,
                enumerable: true,
                get: function():any
                {
                    return $skin;
                },
                set: function(value:any):void
                {
                    if(value === $skin) return;
                    // 记录值
                    if(this.bridge)
                    {
                        if($skin)
                        {
                            // 需要判断桥的类型是否相同，且之前有皮肤，则替换皮肤
                            $skin = this.bridge.replaceSkin(this, $skin, value);
                        }
                        else
                        {
                            // 否则直接包装一下皮肤
                            $skin = this.bridge.wrapSkin(this, value);
                        }
                    }
                    else 
                    {
                        // 不认识的皮肤类型，直接赋值
                        $skin = value;
                    }
                }
            });
            // 如果本来就有皮肤，则赋值皮肤
            if(oriSkin)
                instance.skin = oriSkin;
        });
        // 包装类
        var wrapperCls:IComponentConstructor = <IComponentConstructor>wrapConstruct(cls);
        // 返回包装类
        return wrapperCls;
    } as ClassDecorator;
}

/** 添加子Component */
export function SubComponent(dataExp?:string):PropertyDecorator;
export function SubComponent(compCls:IComponentConstructor, dataExp?:string):PropertyDecorator;
export function SubComponent(skin:any, compCls?:IComponentConstructor, dataExp?:string):PropertyDecorator;
export function SubComponent(prototype:any, propertyKey:string):void;
export function SubComponent(arg1:any, arg2?:any, arg3?:string):any
{
    var oriSkin:any;
    var compCls:IComponentConstructor;
    var dataExp:string;
    // 判断是否是参数化装饰
    if(this === decorateThis)
    {
        // 无参数
        doSubComponent(arg1, arg2);
    }
    else
    {
        // 有参数，分配参数
        if(typeof arg1 === "string" && !arg2 && !arg3)
        {
            dataExp = arg1;
        }
        else if(arg1 instanceof Function)
        {
            compCls = arg1;
            dataExp = arg2;
        }
        else
        {
            oriSkin = arg1;
            compCls = arg2;
            dataExp = arg3;
        }
        // 返回装饰器方法
        return doSubComponent;
    }

    function doSubComponent(prototype:any, propertyKey:string):void
    {
        if(isComponent(prototype))
        {
            // 监听实例化
            listenConstruct(prototype.constructor, function(instance:IComponent):void
            {
                var skin:any = oriSkin;
                var declaredCls:any = Reflect.getMetadata("design:type", prototype, propertyKey);
                var declaredComponentCls:any;
                if(isComponent(declaredCls.prototype))
                    declaredComponentCls = declaredCls;
                var comp:IComponent;
                var temp:IComponent = instance[propertyKey];
                // 篡改属性
                Object.defineProperty(instance, propertyKey, {
                    configurable: true,
                    enumerable: true,
                    get: function():any
                    {
                        // 如果类型声明为Component，则返回Component，否则返回皮肤本身
                        return (declaredComponentCls ? comp : skin);
                    },
                    set: function(value:any):void
                    {
                        if(isComponent(value))
                        {
                            // 取消托管中介者
                            if(comp)
                            {
                                this.undelegate(comp);
                            }
                            // 设置中介者
                            comp = value;
                            // 托管新的中介者
                            if(comp)
                            {
                                // 如果当前中介者没有皮肤就用装饰器皮肤
                                if(skin && !comp.skin) comp.skin = skin;
                            }
                        }
                        else if(value)
                        {
                            // 赋值皮肤
                            skin = value;
                            // 如果存在中介者，则额外赋值中介者皮肤
                            if(comp)
                            {
                                if(comp.skin && comp.status < ComponentStatus.OPENED)
                                {
                                    // 当前有皮肤且中介者尚未打开完毕，说明是现在是皮肤转发阶段，要用老皮肤替换新皮肤的位置
                                    replaceDisplay(comp.bridge, value, comp.skin);
                                    // 同步位置
                                    comp.bridge.syncSkin(value, comp.skin);
                                }
                                else
                                {
                                    // 当前没皮肤，或者中介者已经打开完毕了，说明新皮肤就是要替换老皮肤
                                    comp.skin = value;
                                }
                            }
                        }
                        else
                        {
                            // comp和skin都赋值为空
                            skin = value;
                            if(comp)
                            {
                                comp.skin = value;
                            }
                            comp = value;
                        }
                        // 如果当前中介者已经为正在打开或已打开状态，则额外调用open
                        if(comp)
                        {
                            // 托管中介者
                            this.delegate(comp);
                            // 如果当前中介者已经为正在打开或已打开状态，则额外调用open
                            if(comp.skin)
                            {
                                if(comp.status === ComponentStatus.UNOPEN)
                                {
                                    var getCommonScope:()=>any = ()=>{
                                        return {
                                            $this: this,
                                            $data: this.viewModel,
                                            $bridge: this.bridge,
                                            $currentTarget: comp,
                                            $target: comp
                                        };
                                    };
                                    // 子Component还没有open，open之
                                    if(this.status === ComponentStatus.OPENED)
                                    {
                                        // 父Component已经open了，直接open之
                                        var data:any = dataExp ? evalExp(dataExp, this.viewModel, this.viewModel, this.data, getCommonScope()) : this.data;
                                        if(!data) data = this.data;
                                        // 执行open方法
                                        comp.open(data);
                                    }
                                    else if(this.status < ComponentStatus.OPENED && dataExp)
                                    {
                                        // 父Component也没有open，监听子Component的open，篡改参数
                                        listenApply(comp, "open", ()=>{
                                            var data:any = evalExp(dataExp, this.viewModel, this.viewModel, this.data, getCommonScope());
                                            if(data) return [data];
                                        });
                                    }
                                }
                            }
                        }
                    }
                });
                // 实例化
                if(temp)
                {
                    instance[propertyKey] = temp;
                }
                else if(temp === undefined)
                {
                    // 优先使用是中介者类的元数据类型，其次使用装饰器提供的中介者类型
                    var cls:IConstructor = declaredComponentCls || compCls;
                    if(!cls) throw new Error("必须在类型声明或装饰器中至少一处提供Component的类型");
                    instance[propertyKey] = temp = new cls(skin);
                }
                // 执行回调
                var handlers:((instance:IComponent)=>void)[] = subHandlerDict.get(comp);
                if(handlers)
                {
                    for(var handler of handlers)
                    {
                        handler(comp);
                    }
                    // 移除记录
                    subHandlerDict.delete(comp);
                }
            });
            // 监听销毁
            listenDispose(prototype.constructor, function(instance:IComponent):void
            {
                var comp:IComponent = instance[propertyKey];
                if(comp)
                {
                    // 移除实例
                    instance[propertyKey] = undefined;
                }
            });
        }
    }
}

var onOpenDict:Dictionary<IComponent, number> = new Dictionary();
export function listenOnOpen(prototype:any, before?:(comp:IComponent)=>void, after?:(comp:IComponent)=>void):void
{
    listenApply(prototype.constructor, "onOpen", function(comp:IComponent):void
    {
        // 记录onOpen篡改次数
        var count:number = onOpenDict.get(comp) || 0;
        onOpenDict.set(comp, count + 1);
        // 调用回调
        before && before(comp);
    }, function(comp:IComponent):void
    {
        // 调用回调
        after && after(comp);
        // 递减篡改次数
        var count:number = onOpenDict.get(comp) - 1;
        onOpenDict.set(comp, count);
        // 判断是否所有onOpen都调用完毕，如果完毕了，则启动编译过程
        if(count <= 0)
        {
            // 移除数据
            onOpenDict.delete(comp);
            // 全调用完毕了，按层级顺序由浅入深编译
            var bindTargets:Dictionary<any, any>[] = comp.bindTargets;
            for(var depth in bindTargets)
            {
                var dict:Dictionary<any, any> = bindTargets[depth];
                dict.forEach(currentTarget=>BindUtil.compile(comp, currentTarget));
            }
        }
    });
}

/**
 * 获取显示对象在comp.skin中的嵌套层级
 * 
 * @param {IComponent} comp 中介者
 * @param {*} target 目标显示对象
 * @returns {number} 
 */
export function getDepth(comp:IComponent, target:any):number
{
    var skin:any = comp.skin;
    var bridge:IBridge = comp.bridge;
    var depth:number = 0;
    if(bridge.isMySkin(target))
    {
        while(target && target !== skin)
        {
            depth ++;
            target = bridge.getParent(target);
        }
        // 如果显示对象是没有根的，或者不在skin的显示树中，则返回0
        if(!target) depth = 0;
    }
    return depth;
}

export function searchUIDepth(values:any, comp:IComponent, target:any, callback:(currentTarget:any, target:any, key:string, value:any, leftHandlers?:BindUtil.IStopLeftHandler[], index?:number)=>void, addressing:boolean=false):void
{
    // 获取显示层级
    var depth:number = getDepth(comp, target);
    // 如果有中断编译则将遍历的工作推迟到中断重启后，否则直接开始遍历
    var stopLeftHandlers:BindUtil.IStopLeftHandler[] = target.__stop_left_handlers__;
    if(stopLeftHandlers) stopLeftHandlers.push(handler);
    else handler(target, comp.bindTargets, stopLeftHandlers);

    function handler(target:any, bindTargets:Dictionary<any, any>[], leftHandlers:BindUtil.IStopLeftHandler[]):void
    {
        var index:number = -1;
        if(leftHandlers) index = leftHandlers.indexOf(handler);
        // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
        searchUI(values, target, (currentTarget:any, name:string, exp:string, depth:number)=>{
            if(addressing) currentTarget = currentTarget[name];
            // 记录当前编译目标和命令本体目标到bindTargets中
            var dict:Dictionary<any, any> = bindTargets[depth];
            if(!dict) bindTargets[depth] = dict = new Dictionary();
            dict.set(currentTarget, target);
            // 调用回调
            callback(currentTarget, target, name, exp, leftHandlers, index);
        }, depth);
    }
}

/**
 * 一次绑定多个属性
 * 
 * @export
 * @param {{[path:string]:any}} uiDict ui属性路径和表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindValue(uiDict:{[path:string]:any}):PropertyDecorator;
/**
 * 一次绑定一个属性
 * 
 * @export
 * @param {string} path ui属性路径
 * @param {EvalExp} exp 表达式或方法
 * @returns {PropertyDecorator} 
 */
export function BindValue(path:string, exp:EvalExp):PropertyDecorator;
/**
 * @private
 */
export function BindValue(arg1:{[path:string]:any}|string, arg2?:EvalExp):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        listenOnOpen(prototype, (comp:IComponent)=>{
            // 组织参数字典
            var uiDict:{[name:string]:any};
            if(typeof arg1 == "string")
            {
                uiDict = {};
                uiDict[arg1] = arg2;
            }
            else
            {
                uiDict = arg1;
            }
            // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
            var target:any = comp[propertyKey];
            searchUIDepth(uiDict, comp, target, (currentTarget:any, target:any, name:string, exp:EvalExp)=>{
                // 添加编译指令
                BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileValue, name, exp);
            });
        });
    };
}

/**
 * 只执行表达式，不赋值
 * 
 * @export
 * @param {EvalExp} exp 表达式或方法
 * @returns {PropertyDecorator} 
 */
export function BindExp(exp:EvalExp):PropertyDecorator;
/**
 * 只执行表达式，不赋值
 * 
 * @export
 * @param {EvalExp[]} exps 表达式或方法数组
 * @returns {PropertyDecorator} 
 */
export function BindExp(exps:EvalExp[]):PropertyDecorator;
/**
 * @private
 */
export function BindExp(exp:EvalExp|EvalExp[]):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        listenOnOpen(prototype, (comp:IComponent)=>{
            // 组织参数字典
            var uiDict:{[name:string]:any} = {};
            if(exp instanceof Array)
            {
                for(var key in exp)
                {
                    uiDict[key] = exp[key];
                }
            }
            else
            {
                uiDict[""] = exp;
            }
            // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
            var target:any = comp[propertyKey];
            searchUIDepth(uiDict, comp, target, (currentTarget:any, target:any, name:string, exp:EvalExp)=>{
                // 添加编译指令
                BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileExp, exp);
            });
        });
    };
}

export interface BindFuncDict
{
    [path:string]:(EvalExp)|(EvalExp)[]|undefined|BindFuncDict;
}

/**
 * 一次绑定多个方法
 * 
 * @export
 * @param {BindFuncDict} funcDict ui方法和表达式或方法字典
 * @returns {PropertyDecorator} 
 */
export function BindFunc(funcDict:BindFuncDict):PropertyDecorator;
/**
 * 一次绑定一个方法
 * 
 * @export
 * @param {string} path ui方法路径
 * @param {(EvalExp)|(EvalExp)[]} [exp] 参数表达式或参数表达式数组
 * @returns {PropertyDecorator} 
 */
export function BindFunc(path:string, exp?:(EvalExp)|(EvalExp)[]):PropertyDecorator;
/**
 * @private
 */
export function BindFunc(arg1:BindFuncDict|string, arg2?:(EvalExp)|(EvalExp)[]):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        listenOnOpen(prototype, (comp:IComponent)=>{
            // 组织参数字典
            var funcDict:BindFuncDict;
            if(typeof arg1 == "string")
            {
                funcDict = {};
                funcDict[arg1] = arg2;
            }
            else
            {
                funcDict = arg1;
            }
            // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
            var target:any = comp[propertyKey];
            searchUIDepth(funcDict, comp, target, (currentTarget:any, target:any, name:string, argExps:(EvalExp)|(EvalExp)[])=>{
                // 统一参数类型为字符串数组
                if(!(argExps instanceof Array)) argExps = [argExps];
                // 添加编译指令
                BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileFunc, name, ...argExps);
            });
        });
    };
}

/**
 * 一次绑定多个事件
 * 
 * @export
 * @param {{[type:string]:any}} evtDict 事件类型和表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindOn(evtDict:{[type:string]:any}):PropertyDecorator;
/**
 * 一次绑定一个事件
 * 
 * @export
 * @param {string} type 事件类型
 * @param {EvalExp} exp 表达式或方法
 * @returns {PropertyDecorator} 
 */
export function BindOn(type:string, exp:EvalExp):PropertyDecorator;
/**
 * 为指定对象一次绑定一个事件
 * 
 * @export
 * @param {string} path ui属性路径
 * @param {string} type 事件类型
 * @param {EvalExp} exp 表达式或方法
 * @returns {PropertyDecorator} 
 */
export function BindOn(path:string, type:string, exp:EvalExp):PropertyDecorator;
/**
 * @private
 */
export function BindOn(arg1:{[type:string]:any}|string, arg2?:EvalExp, arg3?:EvalExp):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        listenOnOpen(prototype, (comp:IComponent)=>{
            // 获取编译启动目标
            var target:any = comp[propertyKey];
            // 组织参数字典
            if(typeof arg1 == "string")
            {
                if(arg3)
                {
                    // 指定了UI对象，先去寻找
                    var nameDict:any = {};
                    nameDict[arg1] = "";
                    searchUIDepth(nameDict, comp, target, function (currentTarget, target, type, exp) {
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileOn, arg2, arg3);
                    }, true);
                }
                else
                {
                    var evtDict:any = {};
                    evtDict[arg1] = arg2;
                    // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                    searchUIDepth(evtDict, comp, target, (currentTarget:any, target:any, type:string, exp:string)=>{
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileOn, type, exp);
                    });
                }
            }
            else
            {
                // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                searchUIDepth(arg1, comp, target, (currentTarget:any, target:any, type:string, exp:string)=>{
                    // 添加编译指令
                    BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileOn, type, exp);
                });
            }
        });
    };
}

/**
 * 一次绑定多个显示判断
 * 
 * @export
 * @param {{[path:string]:any}} uiDict ui属性路径和表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindIf(uiDict:{[path:string]:any}):PropertyDecorator;
/**
 * 一次绑定一个显示判断
 * 
 * @export
 * @param {string} path ui属性路径
 * @param {EvalExp} exp 表达式或方法
 * @returns {PropertyDecorator} 
 */
export function BindIf(path:string, exp:EvalExp):PropertyDecorator;
/**
 * 绑定当前显示对象的显示判断
 * 
 * @export
 * @param {string} exp 表达式或方法
 * @returns {PropertyDecorator} 
 */
export function BindIf(exp:EvalExp):PropertyDecorator;
/**
 * @private
 */
export function BindIf(arg1:{[path:string]:any}|EvalExp, arg2?:EvalExp):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        listenOnOpen(prototype, (comp:IComponent)=>{
            var target:any = comp[propertyKey];
            if(typeof arg1 === "string" || arg1 instanceof Function)
            {
                if(!arg2)
                {
                    // 没有指定寻址路径，就是要操作当前对象，但也要经过一次searchUIDepth操作
                    searchUIDepth({r: 13}, comp, target, (currentTarget:any, target:any, name:string, exp:string)=>{
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileIf, arg1);
                    });
                }
                else
                {
                    // 指定了寻址路径，需要寻址
                    var uiDict:{[name:string]:any} = {};
                    uiDict[<string>arg1] = arg2;
                    // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                    searchUIDepth(uiDict, comp, target, (currentTarget:any, target:any, name:string, exp:string)=>{
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileIf, exp);
                    }, true);
                }
            }
            else
            {
                // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                searchUIDepth(arg1, comp, target, (currentTarget:any, target:any, name:string, exp:string)=>{
                    // 添加编译指令
                    BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileIf, exp);
                }, true);
            }
        });
    };
}


/**
 * 一次绑定多个数据集合，如果要指定当前显示对象请使用$target作为key
 * 
 * @export
 * @param {{[name:string]:any}} uiDict ui属性和表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindFor(uiDict:{[name:string]:any}):PropertyDecorator;
/**
 * 绑定数据集合到当前显示对象
 * 
 * @export
 * @param {string} exp 遍历表达式，形如："a in b"（a遍历b的key）或"a of b"（a遍历b的value）
 * @param {IComponentConstructor} [compCls] 提供该参数将使用提供的中介者包装每一个渲染器
 * @param {string} [dataExp] 传递给中介者的数据表达式
 * @returns {PropertyDecorator} 
 */
export function BindFor(exp:string, compCls?:IComponentConstructor, dataExp?:string):PropertyDecorator;
/**
 * 绑定数据集合到指定对象
 * 
 * @export
 * @param {string} name ui属性名称
 * @param {string} exp 遍历表达式，形如："a in b"（a遍历b的key）或"a of b"（a遍历b的value）
 * @param {IComponentConstructor} [compCls] 提供该参数将使用提供的中介者包装每一个渲染器
 * @param {string} [dataExp] 传递给中介者的数据表达式
 * @returns {PropertyDecorator} 
 */
export function BindFor(name:string, exp:string, compCls?:IComponentConstructor, dataExp?:string):PropertyDecorator;
/**
 * @private
 */
export function BindFor(arg1:{[name:string]:any}|string, arg2?:any, arg3?:any, arg4?:string):PropertyDecorator
{
    // 组织参数
    var uiDict:{[name:string]:any};
    var name:string;
    var exp:string;
    var compCls:IComponentConstructor;
    var dataExp:string;
    if(typeof arg1 === "string")
    {
        if(typeof arg2 === "string")
        {
            name = arg1;
            exp = arg2;
            compCls = arg3;
            dataExp = arg4;
        }
        else
        {
            exp = arg1;
            compCls = arg2;
            dataExp = arg3;
        }
    }
    else
    {
        uiDict = arg1;
    }
    return function(prototype:any, propertyKey:string):void
    {
        var declaredCls:any = Reflect.getMetadata("design:type", prototype, propertyKey);
        var declaredComponentCls:any;
        if(isComponent(declaredCls.prototype))
            declaredComponentCls = declaredCls;
        listenOnOpen(prototype, (comp:IComponent)=>{
            // 取到编译目标对象
            var target:any = comp[propertyKey];
            // 开始赋值指令
            if(!uiDict)
            {
                if(!name)
                {
                    // 没有指定寻址路径，就是要操作当前对象，但也要经过一次searchUIDepth操作
                    searchUIDepth({r: 13}, comp, target, (currentTarget:any, target:any, _name:string, _exp:string, leftHandlers:BindUtil.IStopLeftHandler[], index?:number)=>{
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileFor, propertyKey, exp, compCls, declaredComponentCls, dataExp);
                        // 设置中断编译
                        target.__stop_left_handlers__ = leftHandlers ? leftHandlers.splice(index + 1, leftHandlers.length - index - 1) : [];
                    });
                }
                else
                {
                    // 指定了寻址路径，需要寻址
                    var uiDict:{[name:string]:any} = {};
                    uiDict[name] = exp;
                    // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                    searchUIDepth(uiDict, comp, target, (currentTarget:any, target:any, _name:string, _exp:string, leftHandlers:BindUtil.IStopLeftHandler[], index?:number)=>{
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileFor, propertyKey, _exp, compCls, declaredComponentCls, dataExp);
                        // 设置中断编译
                        target.__stop_left_handlers__ = leftHandlers ? leftHandlers.splice(index + 1, leftHandlers.length - index - 1) : [];
                    }, true);
                }
            }
            else
            {
                // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                searchUIDepth(uiDict, comp, target, (currentTarget:any, target:any, _name:string, _exp:string, leftHandlers:BindUtil.IStopLeftHandler[], index?:number)=>{
                    // 添加编译指令
                    BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileFor, propertyKey, _exp, compCls, declaredComponentCls, dataExp);
                    // 设置中断编译
                    target.__stop_left_handlers__ = leftHandlers ? leftHandlers.splice(index + 1, leftHandlers.length - index - 1) : [];
                }, true);
            }
        });
    };
}