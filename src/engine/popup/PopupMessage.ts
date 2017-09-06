/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 弹窗相关的消息
*/
export default class PopupMessage
{
    /**
     * 打开弹窗前的消息
     * 
     * @static
     * @type {string}
     * @memberof PopupMessage
     */
    public static POPUP_BEFORE_OPEN:string = "popupBeforeOpen";
    /**
     * 打开弹窗后的消息
     * 
     * @static
     * @type {string}
     * @memberof PopupMessage
     */
    public static POPUP_AFTER_OPEN:string = "popupAfterOpen";
    /**
     * 关闭弹窗前的消息
     * 
     * @static
     * @type {string}
     * @memberof PopupMessage
     */
    public static POPUP_BEFORE_CLOSE:string = "popupBeforeClose";
    /**
     * 关闭弹窗后的消息
     * 
     * @static
     * @type {string}
     * @memberof PopupMessage
     */
    public static POPUP_AFTER_CLOSE:string = "popupAfterClose";
}