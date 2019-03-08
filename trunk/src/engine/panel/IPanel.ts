import IDisposable from "../../core/interfaces/IDisposable";
import IOpenClose from "../../core/interfaces/IOpenClose";
import IHasBridge from "../bridge/IHasBridge";
import IPanelPolicy from "./IPanelPolicy";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 弹窗接口
*/
export default interface IPanel<S = any, OD = any, CD = any> extends IHasBridge<S>, IOpenClose<OD, CD>, IDisposable
{
    /** 实际显示对象 */
    skin:S;
    /** 弹出策略 */
    policy:IPanelPolicy<S>;
    /** 自定义弹窗遮罩透明度，不传则使用项目默认透明度 */
    maskAlpha?:number;
    /** 弹出当前弹窗（等同于调用PanelManager.pop方法） */
    open(data?:OD, isModel?:boolean, from?:{x:number, y:number}):Promise<any>;
    /** 关闭当前弹窗（等同于调用PanelManager.drop方法） */
    close(data?:CD, to?:{x:number, y:number}):Promise<any>;
    /** 在弹出前调用的方法 */
    onBeforePop(data?:OD, isModel?:boolean, from?:{x:number, y:number}):void;
    /** 在弹出后调用的方法 */
    onAfterPop(data?:OD, isModel?:boolean, from?:{x:number, y:number}):void;
    /** 在关闭前调用的方法 */
    onBeforeDrop(data?:CD, to?:{x:number, y:number}):void;
    /** 在关闭后调用的方法 */
    onAfterDrop(data?:CD, to?:{x:number, y:number}):void;
}