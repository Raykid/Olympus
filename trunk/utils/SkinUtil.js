/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-03-22
 * @modify date 2018-03-22
 *
 * 皮肤工具
*/
/**
 * 替换皮肤
 *
 * @export
 * @param {IBridge} bridge 要使用的桥
 * @param {*} newSkin 替换成为的皮肤
 * @param {*} oldSkin 被替换的皮肤
 */
export function replaceSkin(bridge, newSkin, oldSkin) {
    // 两个皮肤必须都是隶属桥的皮肤
    if (bridge.isMySkin(newSkin) && bridge.isMySkin(oldSkin)) {
        var parent = bridge.getParent(oldSkin);
        if (parent) {
            var index = bridge.getChildIndex(parent, oldSkin);
            bridge.addChildAt(parent, newSkin, index);
            bridge.removeChild(parent, oldSkin);
        }
    }
}
