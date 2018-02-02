import IConstructor from "../../core/interfaces/IConstructor";
import IPanel from "./IPanel";
import IPromptPanel, { IPromptParams, IPromptHandler, IPromptPanelConstructor } from "./IPromptPanel";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * 弹窗管理器，包含弹出弹窗、关闭弹窗、弹窗管理等功能
*/
export default class PanelManager {
    private static PRIORITY_NORMAL;
    private static PRIORITY_PROMPT;
    private _panels;
    private _priorities;
    private _modalDict;
    /**
     * 获取当前显示的弹窗数组（副本）
     *
     * @param {IConstructor} [cls] 弹窗类型，如果传递该参数则只返回该类型的已打开弹窗，否则将返回所有已打开的弹窗
     * @returns {IPanel[]} 已打开弹窗数组
     * @memberof PanelManager
     */
    getOpened(cls?: IConstructor): IPanel[];
    /**
     * 获取弹窗是否已开启
     *
     * @param {IPanel} panel 弹窗对象
     * @returns {boolean} 是否已经开启
     * @memberof PanelManager
     */
    isOpened(panel: IPanel): boolean;
    private updateModalMask(panel);
    /**
     * 打开一个弹窗
     *
     * @param {IPanel} panel 要打开的弹窗
     * @param {*} [data] 数据
     * @param {boolean} [isModal=true] 是否模态弹出
     * @param {{x:number, y:number}} [from] 弹出起点位置
     * @returns {IPanel} 返回弹窗对象
     * @memberof PanelManager
     */
    pop(panel: IPanel, data?: any, isModal?: boolean, from?: {
        x: number;
        y: number;
    }): IPanel;
    /**
     * 关闭一个弹窗
     *
     * @param {IPanel} panel 要关闭的弹窗
     * @param {*} [data] 数据
     * @param {{x:number, y:number}} [to] 关闭终点位置
     * @returns {IPanel} 返回弹窗对象
     * @memberof PanelManager
     */
    drop(panel: IPanel, data?: any, to?: {
        x: number;
        y: number;
    }): IPanel;
    /************************ 下面是通用弹窗的逻辑 ************************/
    private _promptDict;
    /**
     * 注册通用弹窗
     *
     * @param {string} type 通用弹窗要注册到的表现层类型
     * @param {IPromptPanelConstructor} prompt 通用弹窗类型
     * @memberof PanelManager
     */
    registerPrompt(type: string, prompt: IPromptPanelConstructor): void;
    /**
     * 取消注册通用弹窗
     *
     * @param {string} type 要取消注册通用弹窗的表现层类型
     * @memberof PanelManager
     */
    unregisterPrompt(type: string): void;
    /**
     * 显示提示窗口
     *
     * @param {string} msg 要显示的文本
     * @param {...IPromptHandler[]} handlers 按钮回调数组
     * @returns {IPromptPanel} 返回弹窗实体
     * @memberof PanelManager
     */
    prompt(msg: string, ...handlers: IPromptHandler[]): IPromptPanel;
    /**
     * 显示提示窗口
     *
     * @param {IPromptParams} params 弹窗数据
     * @returns {IPromptPanel} 返回弹窗实体
     * @memberof PanelManager
     */
    prompt(params: IPromptParams): IPromptPanel;
    /**
     * 显示警告窗口（只有一个确定按钮）
     *
     * @param {(string|IPromptParams)} msgOrParams 要显示的文本，或者弹窗数据
     * @param {()=>void} [okHandler] 确定按钮点击回调
     * @returns {IPromptPanel} 返回弹窗实体
     * @memberof PanelManager
     */
    alert(msgOrParams: string | IPromptParams, okHandler?: () => void): IPromptPanel;
    /**
     * 显示确认窗口（有一个确定按钮和一个取消按钮）
     *
     * @param {(string|IPromptParams)} msgOrParams 要显示的文本，或者弹窗数据
     * @param {()=>void} [okHandler] 确定按钮点击回调
     * @param {()=>void} [cancelHandler] 取消按钮点击回调
     * @returns {IPromptPanel} 返回弹窗实体
     * @memberof PanelManager
     */
    confirm(msgOrParams: string | IPromptParams, okHandler?: () => void, cancelHandler?: () => void): IPromptPanel;
}
/** 再额外导出一个单例 */
export declare const panelManager: PanelManager;
