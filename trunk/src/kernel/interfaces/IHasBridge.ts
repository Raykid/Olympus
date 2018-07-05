import IBridge from './IBridge';

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-08
 * @modify date 2017-09-08
 * 
 * 标识拥有表现层桥的接口
*/
export default interface IHasBridge
{
    /**
     * 持有一个表现层桥对象
     *
     * @type {IBridge}
     * @memberof IHasBridge
     */
    bridge:IBridge;
}