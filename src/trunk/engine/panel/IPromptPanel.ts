import IPanel from "./IPanel";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-21
 * @modify date 2017-09-21
 * 
 * 通用弹窗的各种接口
*/

export enum ButtonType
{
    normal,
    important
}

export interface IPromptParams
{
    msg:string;
    style?:any;
    title?:string;
    handlers?:IPromptHandler[];
}

export interface IPromptHandler
{
    /** 与按钮绑定的数据 */
    data:any;
    /** 按钮上显示的文本，不传递则默认使用data的字符串值 */
    text?:string;
    /** 回调函数，当前按钮被点击时调用，参数为data对象 */
    handler?:(data?:any)=>void;
    /** 按钮类型，默认为normal */
    buttonType?:ButtonType;
}

export interface IPromptPanelConstructor
{
    new ():IPromptPanel;
}

export default interface IPromptPanel extends IPanel
{
    /**
     * 更新通用提示窗显示
     * @param params 弹窗数据
     */
    update(params:IPromptParams):void;
}