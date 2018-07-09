/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-02-24
 * @modify date 2018-02-24
 *
 * 组件状态枚举
*/
var ComponentStatus;
(function (ComponentStatus) {
    ComponentStatus[ComponentStatus["UNOPEN"] = 0] = "UNOPEN";
    ComponentStatus[ComponentStatus["OPENING"] = 1] = "OPENING";
    ComponentStatus[ComponentStatus["OPENED"] = 2] = "OPENED";
    ComponentStatus[ComponentStatus["CLOSING"] = 3] = "CLOSING";
    ComponentStatus[ComponentStatus["CLOSED"] = 4] = "CLOSED";
    ComponentStatus[ComponentStatus["DISPOSING"] = 5] = "DISPOSING";
    ComponentStatus[ComponentStatus["DISPOSED"] = 6] = "DISPOSED";
})(ComponentStatus || (ComponentStatus = {}));
export default ComponentStatus;
