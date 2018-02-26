/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-02-24
 * @modify date 2018-02-24
 *
 * 中介者状态枚举
*/
var MediatorStatus;
(function (MediatorStatus) {
    MediatorStatus[MediatorStatus["UNOPEN"] = 0] = "UNOPEN";
    MediatorStatus[MediatorStatus["OPENING"] = 1] = "OPENING";
    MediatorStatus[MediatorStatus["OPENED"] = 2] = "OPENED";
    MediatorStatus[MediatorStatus["CLOSING"] = 3] = "CLOSING";
    MediatorStatus[MediatorStatus["CLOSED"] = 4] = "CLOSED";
    MediatorStatus[MediatorStatus["DISPOSING"] = 5] = "DISPOSING";
    MediatorStatus[MediatorStatus["DISPOSED"] = 6] = "DISPOSED";
})(MediatorStatus || (MediatorStatus = {}));
export default MediatorStatus;
