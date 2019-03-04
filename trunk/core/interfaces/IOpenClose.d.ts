/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-22
 * @modify date 2017-09-22
 *
 * 可开关的接口
*/
export default interface IOpenClose<OD = any, CD = any> {
    /**
     * 打开时传递的data对象
     *
     * @type {OD}
     * @memberof IOpenClose
     */
    data: OD;
    /** 开 */
    open(data?: OD, ...args: any[]): Promise<CD>;
    /** 关 */
    close(data?: CD, ...args: any[]): void;
}
