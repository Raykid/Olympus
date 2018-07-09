import IBridge from "../interfaces/IBridge";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-07-05
 * @modify date 2018-07-05
 * 
 * 表现层桥工具
*/
const bridgeDict:{[type:string]:[IBridge, boolean]} = {};
const bridgeList:[IBridge, boolean][] = [];

/**
 * 获取所有表现层桥
 *
 * @export
 * @returns {[IBridge, boolean][]}
 */
export function getBridges():[IBridge, boolean][]
{
    return bridgeList;
}

/**
 * 获取表现层桥实例
 * 
 * @param {string} type 表现层类型
 * @returns {IBridge} 表现层桥实例
 * @memberof BridgeManager
 */
export function getBridge(type:string):[IBridge, boolean]
{
    return bridgeDict[type];
}

/**
 * 通过给出一个显示对象皮肤实例来获取合适的表现层桥实例
 * 
 * @param {*} skin 皮肤实例
 * @returns {IBridge|null} 皮肤所属表现层桥实例
 * @memberof BridgeManager
 */
export function getBridgeBySkin(skin:any):IBridge|null
{
    if(skin)
    {
        // 遍历所有已注册的表现层桥进行判断
        for(var data of bridgeList)
        {
            var bridge:IBridge = data[0];
            if(bridge.isMySkin(skin)) return bridge;
        }
    }
    return null;
}

/**
 * 注册一个表现层桥实例到框架中
 * 
 * @param {...IBridge[]} bridges 要注册的所有表现层桥
 * @memberof BridgeManager
 */
export function registerBridge(...bridges:IBridge[]):void
{
    // 记录
    for(var bridge of bridges)
    {
        var type:string = bridge.type;
        if(!this._bridgeDict[type])
        {
            var data:[IBridge, boolean] = [bridge, false];
            this._bridgeDict[type] = data;
            this._bridgeList.push(data);
        }
    }
}
