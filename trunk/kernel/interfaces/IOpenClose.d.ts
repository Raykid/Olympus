/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-22
 * @modify date 2017-09-22
 *
 * 可开关的接口
*/
export default interface IOpenClose {
    /**
     * 打开时传递的data对象
     *
     * @type {*}
     * @memberof IOpenClose
     */
    data: any;
    /**
     * 打开
     *
     * @param {*} [data] 打开时传递的参数
     * @returns {*}
     * @memberof IOpenClose
     */
    open(data?: any): any;
    /**
     * 关闭
     *
     * @param {*} [data] 关闭时传递的参数
     * @returns {*}
     * @memberof IOpenClose
     */
    close(data?: any): any;
}
