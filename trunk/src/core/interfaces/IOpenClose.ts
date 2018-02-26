/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-22
 * @modify date 2017-09-22
 * 
 * 可开关的接口
*/
export default interface IOpenClose
{
    /**
     * 打开时传递的data对象
     * 
     * @type {*}
     * @memberof IOpenClose
     */
    data:any;

    /** 开 */
    open(data?:any, ...args:any[]):any;
    /** 关 */
    close(data?:any, ...args:any[]):any;
}