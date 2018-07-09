/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 *
 * 模块消息类型
*/
var ModuleMessageType = /** @class */ (function () {
    function ModuleMessageType() {
    }
    /**
     * 切换模块消息
     *
     * @static
     * @type {string}
     * @memberof ModuleMessage
     */
    ModuleMessageType.MODULE_CHANGE = "moduleChange";
    /**
     * 切换模块失败消息
     *
     * @static
     * @type {string}
     * @memberof ModuleMessage
     */
    ModuleMessageType.MODULE_CHANGE_FAILED = "moduleChangeFailed";
    /**
     * 加载模块失败消息
     *
     * @static
     * @type {string}
     * @memberof ModuleMessage
     */
    ModuleMessageType.MODULE_LOAD_ASSETS_ERROR = "moduleLoadAssetsError";
    return ModuleMessageType;
}());
export default ModuleMessageType;
