import IBridge from "../interfaces/IBridge";
/**
 * 获取所有表现层桥
 *
 * @export
 * @returns {[IBridge, boolean][]}
 */
export declare function getBridges(): [IBridge, boolean][];
/**
 * 获取表现层桥实例
 *
 * @param {string} type 表现层类型
 * @returns {IBridge} 表现层桥实例
 * @memberof BridgeManager
 */
export declare function getBridge(type: string): [IBridge, boolean];
/**
 * 通过给出一个显示对象皮肤实例来获取合适的表现层桥实例
 *
 * @param {*} skin 皮肤实例
 * @returns {IBridge|null} 皮肤所属表现层桥实例
 * @memberof BridgeManager
 */
export declare function getBridgeBySkin(skin: any): IBridge | null;
/**
 * 注册一个表现层桥实例到框架中
 *
 * @param {...IBridge[]} bridges 要注册的所有表现层桥
 * @memberof BridgeManager
 */
export declare function registerBridge(...bridges: IBridge[]): void;
