/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * 弹窗相关的消息类型
*/
var PanelMessageType = /** @class */ (function () {
    function PanelMessageType() {
    }
    /**
     * 打开弹窗前的消息
     *
     * @static
     * @type {string}
     * @memberof PanelMessage
     */
    PanelMessageType.PANEL_BEFORE_POP = "panelBeforePop";
    /**
     * 打开弹窗后的消息
     *
     * @static
     * @type {string}
     * @memberof PanelMessage
     */
    PanelMessageType.PANEL_AFTER_POP = "panelAfterPop";
    /**
     * 关闭弹窗前的消息
     *
     * @static
     * @type {string}
     * @memberof PanelMessage
     */
    PanelMessageType.PANEL_BEFORE_DROP = "panelBeforeDrop";
    /**
     * 关闭弹窗后的消息
     *
     * @static
     * @type {string}
     * @memberof PanelMessage
     */
    PanelMessageType.PANEL_AFTER_DROP = "panelAfterDrop";
    return PanelMessageType;
}());
export default PanelMessageType;
