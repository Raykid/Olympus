import IMessage from "../message/IMessage";
import Command from "./Command";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-01
 * @modify date 2017-09-01
 *
 * 内核命令接口
*/
export default interface ICommandConstructor {
    new (msg: IMessage): Command;
}
