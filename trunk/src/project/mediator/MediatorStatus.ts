/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-02-24
 * @modify date 2018-02-24
 * 
 * 中介者状态枚举
*/
enum MediatorStatus
{
    UNOPEN,
    OPENING,
    OPENED,
    CLOSING,
    CLOSED,
    DISPOSING,
    DISPOSED
}
export default MediatorStatus;