/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 *
 * 模块消息
*/
var ModuleMessage = /** @class */ (function () {
    function ModuleMessage() {
    }
    /**
     * 切换模块消息
     *
     * @static
     * @type {string}
     * @memberof ModuleMessage
     */
    ModuleMessage.MODULE_CHANGE = "moduleChange";
    /**
     * 切换模块失败消息
     *
     * @static
     * @type {string}
     * @memberof ModuleMessage
     */
    ModuleMessage.MODULE_CHANGE_FAILED = "moduleChangeFailed";
    /**
     * 加载模块失败消息
     *
     * @static
     * @type {string}
     * @memberof ModuleMessage
     */
    ModuleMessage.MODULE_LOAD_ASSETS_ERROR = "moduleLoadAssetsError";
    return ModuleMessage;
}());
export default ModuleMessage;
