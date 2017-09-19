/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-01
 * @modify date 2017-09-01
 * 
 * 可回收接口
*/
export default interface IDisposable
{
    /** 是否已经被销毁 */
    readonly disposed:boolean;
    /** 销毁 */
    dispose():void;
}