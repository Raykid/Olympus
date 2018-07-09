import IBridgeExt from './IBridgeExt';
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * 用来管理所有表现层对象
*/
export default class BridgeManager {
    /**
     * 获取当前的表现层桥实例（规则是取当前模块的第一个拥有bridge属性的Mediator的bridge）
     *
     * @readonly
     * @type {IBridgeExt}
     * @memberof BridgeManager
     */
    readonly currentBridge: IBridgeExt;
    /**
     * 获取所有表现层桥
     *
     * @readonly
     * @type {IBridgeExt[]}
     * @memberof BridgeManager
     */
    readonly bridges: IBridgeExt[];
    private getAllHasBridges(hasBridge);
    /**
     * 获取表现层桥实例
     *
     * @param {string} type 表现层类型
     * @returns {IBridgeExt} 表现层桥实例
     * @memberof BridgeManager
     */
    getBridge(type: string): IBridgeExt;
    /**
     * 通过给出一个显示对象皮肤实例来获取合适的表现层桥实例
     *
     * @param {*} skin 皮肤实例
     * @returns {IBridgeExt|null} 皮肤所属表现层桥实例
     * @memberof BridgeManager
     */
    getBridgeBySkin(skin: any): IBridgeExt | null;
    /**
     * 注册一个表现层桥实例到框架中
     *
     * @param {...IBridge[]} bridges 要注册的所有表现层桥
     * @memberof BridgeManager
     */
    registerBridge(...bridges: IBridgeExt[]): void;
    private testAllInit();
}
/** 再额外导出一个单例 */
export declare const bridgeManager: BridgeManager;
