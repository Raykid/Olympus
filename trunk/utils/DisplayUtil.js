/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-03-22
 * @modify date 2018-03-22
 *
 * 显示工具
*/
/**
 * 替换显示
 *
 * @export
 * @param {IBridge} bridge 要使用的桥
 * @param {*} newSkin 替换成为的显示
 * @param {*} oldSkin 被替换的显示
 */
export function replaceDisplay(bridge, newDisplay, oldDisplay) {
    // 两个皮肤必须都是隶属桥的皮肤
    if (bridge.isMySkin(newDisplay) && bridge.isMySkin(oldDisplay)) {
        var parent = bridge.getParent(oldDisplay);
        if (parent) {
            var index = bridge.getChildIndex(parent, oldDisplay);
            bridge.addChildAt(parent, newDisplay, index);
            bridge.removeChild(parent, oldDisplay);
        }
    }
}
