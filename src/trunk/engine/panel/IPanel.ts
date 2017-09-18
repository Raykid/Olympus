import IDisposable from "../../core/interfaces/IDisposable";
import IHasBridge from "../../view/bridge/IHasBridge";
import IPanelPolicy from "./IPanelPolicy";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 弹窗接口
*/
export default interface IPanel extends IHasBridge, IDisposable
{
    /** 获取弹出策略 */
    getPolicy():IPanelPolicy;
    /** 设置切换策略 */
    setPolicy(policy:IPanelPolicy):void;
    /** 弹出当前弹窗（等同于调用PanelManager.pop方法） */
    pop(data?:any, isModel?:boolean, from?:{x:number, y:number}):IPanel;
    /** 关闭当前弹窗（等同于调用PanelManager.drop方法） */
    drop(data?:any, to?:{x:number, y:number}):IPanel;
    /** 在弹出前调用的方法 */
    onBeforePop?(data?:any, isModel?:boolean, from?:{x:number, y:number}):void;
    /** 在弹出后调用的方法 */
    onAfterPop?(data?:any, isModel?:boolean, from?:{x:number, y:number}):void;
    /** 在关闭前调用的方法 */
    onBeforeDrop?(data?:any, to?:{x:number, y:number}):void;
    /** 在关闭后调用的方法 */
    onAfterDrop?(data?:any, to?:{x:number, y:number}):void;
}