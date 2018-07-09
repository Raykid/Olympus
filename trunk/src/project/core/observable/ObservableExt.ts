import IMessage from '../../../kernel/interfaces/IMessage';
import Observable from '../../../kernel/observable/Observable';
import ICommandConstructor from "../command/ICommandConstructor";
import IObservableExt from './IObservableExt';

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-31
 * @modify date 2017-10-31
 * 
 * 可观察接口的默认实现对象，会将收到的消息通知给注册的回调
*/
export default class ObservableExt extends Observable implements IObservableExt
{
    private _commandDict:{[type:string]:(ICommandConstructor)[]} = {};

    private handleCommands(msg:IMessage):void
    {
        var commands:(ICommandConstructor)[] = this._commandDict[msg.__type];
        if(commands)
        {
            commands = commands.concat();
            for(var cls of commands)
            {
                // 执行命令
                new cls(msg).exec();
            }
        }
    }
    
    protected handleMessages(msg:IMessage):void
    {
        // 在此之前先处理Command
        this.handleCommands(msg);
        super.handleMessages(msg);
    }

    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     * 
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof Observable
     */
    public mapCommand(type:string, cmd:ICommandConstructor):void
    {
        // 销毁判断
        if(this._disposed) return;
        var commands:(ICommandConstructor)[] = this._commandDict[type];
        if(!commands) this._commandDict[type] = commands = [];
        if(commands.indexOf(cmd) < 0) commands.push(cmd);
    }

    /**
     * 注销命令
     * 
     * @param {string} type 要注销的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器
     * @returns {void} 
     * @memberof Observable
     */
    public unmapCommand(type:string, cmd:ICommandConstructor):void
    {
        // 销毁判断
        if(this._disposed) return;
        var commands:(ICommandConstructor)[] = this._commandDict[type];
        if(!commands) return;
        var index:number = commands.indexOf(cmd);
        if(index < 0) return;
        commands.splice(index, 1);
    }

    /** 销毁 */
    public dispose():void
    {
        // 清空所有命令
        this._commandDict = null;
        // 调用基类方法
        super.dispose();
    }
}