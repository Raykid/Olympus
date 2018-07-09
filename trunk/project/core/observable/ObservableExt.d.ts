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
export default class ObservableExt extends Observable implements IObservableExt {
    private _commandDict;
    private handleCommands(msg);
    protected handleMessages(msg: IMessage): void;
    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     *
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof Observable
     */
    mapCommand(type: string, cmd: ICommandConstructor): void;
    /**
     * 注销命令
     *
     * @param {string} type 要注销的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器
     * @returns {void}
     * @memberof Observable
     */
    unmapCommand(type: string, cmd: ICommandConstructor): void;
    /** 销毁 */
    dispose(): void;
}
