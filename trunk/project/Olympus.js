import { engine } from './Engine';
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 *
 * Olympus框架便捷启动与框架外观模块
*/
var Olympus = /** @class */ (function () {
    function Olympus() {
    }
    /**
     * 启动Olympus框架
     *
     * @static
     * @param {IInitParams} params 启动参数
     * @memberof Olympus
     */
    Olympus.startup = function (params) {
        // 初始化引擎模块
        engine.initialize(params);
    };
    return Olympus;
}());
export default Olympus;
