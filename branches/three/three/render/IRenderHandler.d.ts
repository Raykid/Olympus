/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-02-23
 * @modify date 2018-02-23
 *
 * 渲染响应器接口
*/
export default interface IRenderHandler {
    /**
     * 渲染驱动函数
     *
     * @memberof IRenderHandler
     */
    render(): void;
    /**
     * 页面尺寸变化时调用，给出当前页面尺寸
     *
     * @param {number} width 页面宽度
     * @param {number} height 页面高度
     * @memberof IRenderHandler
     */
    resize(width: number, height: number): void;
}
