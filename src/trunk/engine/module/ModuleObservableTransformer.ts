import IObservable from "../../core/observable/IObservable";
import IModuleObservable from "./IModuleObservable";
import IMessage from "../../core/message/IMessage";
import ICommandConstructor from "../../core/command/ICommandConstructor";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-07
 * @modify date 2017-11-07
 * 
 * IModuleObservable到IObservable的变压器
*/
export default class ModuleObservableTransformer implements IObservable
{
    private _module:IModuleObservable;

    public constructor(module:IModuleObservable)
    {
        this._module = module;
    }

    /**
     * 派发内核消息
     * 
     * @param {IMessage} msg 内核消息实例
     * @memberof ModuleObservableTransformer
     */
    public dispatch(msg:IMessage):void;
    /**
     * 派发内核消息，消息会转变为CommonMessage类型对象
     * 
     * @param {string} type 消息类型
     * @param {...any[]} params 消息参数列表
     * @memberof ModuleObservableTransformer
     */
    public dispatch(type:string, ...params:any[]):void;
    /** dispatch方法实现 */
    public dispatch(typeOrMsg:string|IMessage, ...params:any[]):void
    {
        this._module.dispatchModule(<any>typeOrMsg, ...params);
    }

    /**
     * 监听内核消息
     * 
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof ModuleObservableTransformer
     */
    public listen(type:IConstructor|string, handler:Function, thisArg?:any):void
    {
        this._module.listenModule(type, handler, thisArg);
    }

    /**
     * 移除内核消息监听
     * 
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof ModuleObservableTransformer
     */
    public unlisten(type:IConstructor|string, handler:Function, thisArg?:any):void
    {
        this._module.unlistenModule(type, handler, thisArg);
    }

    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     * 
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof ModuleObservableTransformer
     */
    public mapCommand(type:string, cmd:ICommandConstructor):void
    {
        this._module.mapCommandModule(type, cmd);
    }

    /**
     * 注销命令
     * 
     * @param {string} type 要注销的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器
     * @returns {void} 
     * @memberof ModuleObservableTransformer
     */
    public unmapCommand(type:string, cmd:ICommandConstructor):void
    {
        this._module.unmapCommandModule(type, cmd);
    }
}