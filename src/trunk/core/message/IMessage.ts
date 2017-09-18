/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-01
 * @modify date 2017-09-01
 * 
 * 框架内核消息接口
*/
export default interface IMessage
{
    /**
     * 获取消息类型
     * 
     * @returns {string} 消息类型
     * @memberof IMessage
     */
    getType():string;
}