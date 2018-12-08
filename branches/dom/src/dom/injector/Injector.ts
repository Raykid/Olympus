import { BindData, bindManager } from 'olympus-r/engine/bind/BindManager';
import { EvalExp } from 'olympus-r/engine/bind/Utils';
import { IWatcher } from 'olympus-r/engine/bind/Watcher';
import { bridgeManager } from "olympus-r/engine/bridge/BridgeManager";
import { ICompileTarget, listenOnOpen, pushCompileCommand, searchUIDepth } from 'olympus-r/engine/injector/BindUtil';
import { MediatorClass } from "olympus-r/engine/injector/Injector";
import IMediator from 'olympus-r/engine/mediator/IMediator';
import { listenApply, listenConstruct } from "olympus-r/utils/ConstructUtil";
import DOMBridge from "../../DOMBridge";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-09
 * @modify date 2017-10-09
 * 
 * 负责注入的模块
*/
export function DOMMediatorClass(moduleName:string, skin:string, ...skins:string[]):ClassDecorator
{
    return function(cls:IConstructor):any
    {
        // 调用MediatorClass方法
        cls = <IConstructor>MediatorClass(moduleName)(cls);
        // 监听类型实例化，转换皮肤格式
        var finalSkin:string|string[];
        if(skins.length === 0)
        {
            finalSkin = skin;
        }
        else
        {
            skins.unshift(skin);
            finalSkin = skins;
        }
        listenConstruct(cls, mediator=>{
            // 先赋值桥
            mediator.bridge = bridgeManager.getBridge(DOMBridge.TYPE);
            // 然后监听onOpen，在onOpen中设置皮肤
            listenApply(mediator, "__beforeOnOpen", mediator=>{
                mediator.skin = finalSkin;
            });
        });
        // 返回结果类型
        return cls;
    } as ClassDecorator;
}

/**
 * 编译css命令
 */
function compileCSS(mediator:IMediator, currentTarget:ICompileTarget, target:any, envModels:any[], dict:{[name:string]:EvalExp}):void
{
    var watcher:IWatcher;
    var bindData:BindData = bindManager.getBindData(mediator);
    bindManager.addBindHandler(mediator, ()=>{
        // 如果之前绑定过，则要先销毁之
        if(watcher) watcher.dispose();
        // 取出当前已有的className
        var curClassName:string = currentTarget["className"];
        // 生成表达式数组
        var names:string[] = [];
        var exps:EvalExp[] = [];
        for(var name in dict)
        {
            names.push(name);
            exps.push(dict[name]);
        }
        // 绑定新的订阅者，表达式为字典中的所有表达式组成的数组
        var exp:string = "[" + exps.join(",") + "]";
        watcher = bindData.bind.createWatcher(currentTarget, target, exp, (judges:boolean[])=>{
            var resultNames:string[] = names.filter((name:string, index:number)=>judges[index]);
            if(curClassName !== "") resultNames.unshift(curClassName);
            // 为目标的className属性赋值
            currentTarget["className"] = resultNames.join(" ");
        }, mediator.viewModel, ...envModels, mediator.viewModel);
    });
}

/**
 * 一次绑定多个className
 *
 * @export
 * @param {{[path:string]:{[name:string]:EvalExp}}} uiDict 寻址表达式字典
 * @returns {PropertyDecorator}
 */
export function BindCSS(uiDict:{[path:string]:{[name:string]:EvalExp}}):PropertyDecorator;
/**
 * 一次绑定一个className
 * 
 * @export
 * @param {string} path ui属性路径
 * @param {{[name:string]:EvalExp}} classDict 一个字典，key是className的值，value是判断表达式
 * @returns {PropertyDecorator} 
 */
export function BindCSS(path:string, classDict:{[name:string]:EvalExp}):PropertyDecorator;
/**
 * 绑定当前对象的className
 * 
 * @export
 * @param {{[name:string]:EvalExp}} classDict 一个字典，key是className的值，value是判断表达式
 * @returns {PropertyDecorator} 
 */
export function BindCSS(classDict:{[name:string]:EvalExp}):PropertyDecorator;
/**
 * @private
 */
export function BindCSS(arg1:any, arg2?:any):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        listenOnOpen(prototype, (mediator:IMediator)=>{
            var target:any = mediator[propertyKey];
            if(typeof arg1 === "string")
            {
                // 指定了寻址路径，需要寻址
                var uiDict:{[name:string]:any} = {};
                uiDict[<string>arg1] = 13;
                // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                searchUIDepth(uiDict, mediator, target, (currentTarget:any, target:any)=>{
                    // 添加编译指令
                    pushCompileCommand(currentTarget, target, compileCSS, arg2);
                }, true);
            }
            else
            {
                let hasPath:boolean;
                for(var key in arg1)
                {
                    hasPath = (typeof arg1[key] === "object");
                    break;
                }
                if(hasPath)
                {
                    // 生成寻址字典
                    var uiDict:{[name:string]:any} = {};
                    for(var name in arg1)
                    {
                        uiDict[name] = 13;
                    }
                    // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                    searchUIDepth(uiDict, mediator, target, (currentTarget:any, target:any, name:string)=>{
                        // 添加编译指令
                        pushCompileCommand(currentTarget, target, compileCSS, arg1[name]);
                    }, true);
                }
                else
                {
                    // 没有指定寻址路径，就是要操作当前对象，但也要经过一次searchUIDepth操作
                    searchUIDepth({r: 13}, mediator, target, (currentTarget:any, target:any)=>{
                        // 添加编译指令
                        pushCompileCommand(currentTarget, target, compileCSS, arg1);
                    });
                }
            }
        });
    };
}