/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-01-08
 * @modify date 2018-01-08
 *
 * 引擎消息类型
*/
var EngineMessage = /** @class */ (function () {
    function EngineMessage() {
    }
    /**
     * 引擎初始化完毕消息
     *
     * @static
     * @type {string}
     * @memberof EngineMessage
     */
    EngineMessage.INITIALIZED = "initialized";
    /**
     * 首模块开启完毕消息
     *
     * @static
     * @type {string}
     * @memberof EngineMessage
     */
    EngineMessage.FIRST_MODULE_OPENED = "firstModuleOpened";
    return EngineMessage;
}());
export default EngineMessage;
