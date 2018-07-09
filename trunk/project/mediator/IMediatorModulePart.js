/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-01-30
 * @modify date 2018-01-30
 *
 * 该接口规定了中介者具有的模块部分功能
*/
export var ModuleOpenStatus;
(function (ModuleOpenStatus) {
    ModuleOpenStatus[ModuleOpenStatus["Stop"] = 0] = "Stop";
    ModuleOpenStatus[ModuleOpenStatus["BeforeOpen"] = 1] = "BeforeOpen";
    ModuleOpenStatus[ModuleOpenStatus["AfterOpen"] = 2] = "AfterOpen";
})(ModuleOpenStatus || (ModuleOpenStatus = {}));
