/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-02-24
 * @modify date 2018-02-24
 *
 * 组件状态枚举
*/
declare enum ComponentStatus {
    UNOPEN = 0,
    OPENING = 1,
    OPENED = 2,
    CLOSING = 3,
    CLOSED = 4,
    DISPOSING = 5,
    DISPOSED = 6,
}
export default ComponentStatus;
