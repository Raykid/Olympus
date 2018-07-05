/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * 模块消息
*/
export default class ModuleMessage
{
    /**
     * 切换模块消息
     * 
     * @static
     * @type {string}
     * @memberof ModuleMessage
     */
    public static MODULE_CHANGE:string = "moduleChange";
    /**
     * 切换模块失败消息
     * 
     * @static
     * @type {string}
     * @memberof ModuleMessage
     */
    public static MODULE_CHANGE_FAILED:string = "moduleChangeFailed";
    /**
     * 加载模块失败消息
     * 
     * @static
     * @type {string}
     * @memberof ModuleMessage
     */
    public static MODULE_LOAD_ASSETS_ERROR:string = "moduleLoadAssetsError";
}