import IPanel from "./IPanel";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 弹窗动画策略，负责将弹窗动画与弹窗实体解耦
*/
export default interface IPanelPolicy<S = any>
{
    /**
     * 添加显示前准备阶段调用
     * @param panel 弹出框对象
     */
    prepare?(panel:IPanel<S>):void;
    /**
     * 显示时调用
     * 
     * @param {IPanel<S>} panel 弹出框对象
     * @param {{x:number, y:number}} [from] 动画起始点
     * @returns {Promise<void>}
     * @memberof IPanelPolicy
     */
    pop(panel:IPanel<S>, from?:{x:number, y:number}):Promise<void>;
    /**
     * 关闭时调用
     * @param {IPanel<S>} panel 弹出框对象
     * @param {{x:number, y:number}} [to] 动画完结点
     * @returns {Promise<void>}
     * @memberof IPanelPolicy
     */
    drop(panel:IPanel<S>, to?:{x:number, y:number}):Promise<void>;
}