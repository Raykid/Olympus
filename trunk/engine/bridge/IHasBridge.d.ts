import IBridge from "./IBridge";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-08
 * @modify date 2017-09-08
 *
 * 标识拥有表现层桥的接口
*/
export default interface IHasMediatorBridge {
    /**
     * 表现层桥
     */
    bridge: IBridge;
}
