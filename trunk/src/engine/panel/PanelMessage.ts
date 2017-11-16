/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 弹窗相关的消息
*/
export default class PanelMessage
{
    /**
     * 打开弹窗前的消息
     * 
     * @static
     * @type {string}
     * @memberof PanelMessage
     */
    public static PANEL_BEFORE_POP:string = "panelBeforePop";
    /**
     * 打开弹窗后的消息
     * 
     * @static
     * @type {string}
     * @memberof PanelMessage
     */
    public static PANEL_AFTER_POP:string = "panelAfterPop";
    /**
     * 关闭弹窗前的消息
     * 
     * @static
     * @type {string}
     * @memberof PanelMessage
     */
    public static PANEL_BEFORE_DROP:string = "panelBeforeDrop";
    /**
     * 关闭弹窗后的消息
     * 
     * @static
     * @type {string}
     * @memberof PanelMessage
     */
    public static PANEL_AFTER_DROP:string = "panelAfterDrop";
}